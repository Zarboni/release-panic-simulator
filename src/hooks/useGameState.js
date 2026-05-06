import { useState, useEffect, useCallback, useRef } from 'react';
import { scenarios } from '../data/scenarios';

const PANELS = ['tests', 'bugs', 'pipeline', 'risk'];

function loadHighScore() {
  try { return parseInt(localStorage.getItem('rps_highscore') || '0', 10); } catch { return 0; }
}
function saveHighScore(score) {
  try { localStorage.setItem('rps_highscore', String(score)); } catch {}
}

const INITIAL_STATE = {
  gamePhase: 'intro',
  currentScenarioIndex: null,
  timer: 0,
  isTimerRunning: false,
  investigatedPanels: [],
  decision: null,
  scenarioScore: 0,
  scoreBreakdown: null,
  totalScore: 0,
  completedScenarios: [],
  terminalLogs: [],
};

export function useGameState() {
  const [state, setState] = useState(INITIAL_STATE);
  const timerRef = useRef(null);
  const logIdRef = useRef(0);

  const currentScenario =
    state.currentScenarioIndex !== null ? scenarios[state.currentScenarioIndex] : null;

  const highScore = loadHighScore();

  // Countdown timer
  useEffect(() => {
    if (!state.isTimerRunning) return;
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timer <= 1) {
          clearInterval(timerRef.current);
          return {
            ...prev,
            timer: 0,
            isTimerRunning: false,
            gamePhase: 'outcome',
            decision: 'timeout',
            scenarioScore: 0,
            scoreBreakdown: { base: 0, time: 0, investigation: 0, thoroughness: 0, total: 0 },
          };
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [state.isTimerRunning]);

  const addLog = useCallback((message, level = 'INFO') => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    logIdRef.current += 1;
    const id = logIdRef.current;
    setState(prev => ({
      ...prev,
      terminalLogs: [...prev.terminalLogs.slice(-60), { id, time, level, message }],
    }));
  }, []);

  const startScenario = useCallback((index) => {
    clearInterval(timerRef.current);
    const scenario = scenarios[index];
    setState(prev => ({
      ...INITIAL_STATE,
      gamePhase: 'playing',
      currentScenarioIndex: index,
      timer: scenario.timeLimit,
      isTimerRunning: true,
      totalScore: prev.totalScore,
      completedScenarios: prev.completedScenarios,
      terminalLogs: [],
      investigatedPanels: [],
    }));
  }, []);

  // Seed initial terminal logs after scenario starts
  useEffect(() => {
    if (state.gamePhase !== 'playing' || !currentScenario) return;
    const s = currentScenario;
    const initialLogs = [
      { msg: `QA Terminal v2.4.1 initialised`, level: 'INFO' },
      { msg: `Loading release data for ${s.subtitle}...`, level: 'INFO' },
      { msg: `Branch: ${s.pipeline.branch}`, level: 'INFO' },
      { msg: `Commit: ${s.pipeline.commit} · Triggered by: ${s.pipeline.triggeredBy}`, level: 'INFO' },
      { msg: `Test results loaded — ${s.testResults.failed} failure(s) detected`, level: s.testResults.failed > 0 ? 'WARN' : 'INFO' },
      { msg: `Open bugs: ${s.bugs.filter(b => b.status === 'OPEN').length} · Critical: ${s.bugs.filter(b => b.severity === 'CRITICAL' && b.status === 'OPEN').length}`, level: s.bugs.some(b => b.severity === 'CRITICAL' && b.status === 'OPEN') ? 'ERROR' : 'WARN' },
      { msg: `Risk assessment score: ${s.riskScore}/100`, level: s.riskScore >= 70 ? 'ERROR' : s.riskScore >= 40 ? 'WARN' : 'INFO' },
      { msg: `Awaiting QA decision. Timer started.`, level: 'INFO' },
    ];

    let delay = 300;
    initialLogs.forEach(({ msg, level }) => {
      setTimeout(() => {
        logIdRef.current += 1;
        const id = logIdRef.current;
        const now = new Date();
        const time = now.toTimeString().slice(0, 8);
        setState(prev => ({
          ...prev,
          terminalLogs: [...prev.terminalLogs.slice(-60), { id, time, level, message: msg }],
        }));
      }, delay);
      delay += 280;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentScenarioIndex, state.gamePhase]);

  const investigatePanel = useCallback((panelName) => {
    setState(prev => {
      if (prev.investigatedPanels.includes(panelName)) return prev;
      const now = new Date().toTimeString().slice(0, 8);
      logIdRef.current += 1;
      const id = logIdRef.current;
      const panelLabels = { tests: 'Test Results', bugs: 'Bug Tracker', pipeline: 'CI Pipeline', risk: 'Risk Assessment' };
      return {
        ...prev,
        investigatedPanels: [...prev.investigatedPanels, panelName],
        terminalLogs: [
          ...prev.terminalLogs.slice(-60),
          { id, time: now, level: 'INFO', message: `User opened panel: ${panelLabels[panelName] || panelName}` },
        ],
      };
    });
  }, []);

  const makeDecision = useCallback((decision) => {
    if (!currentScenario) return;
    clearInterval(timerRef.current);

    const scenario = currentScenario;
    const isCorrect = decision === scenario.correctDecision;
    const timeBonus = isCorrect ? Math.min(Math.floor(state.timer * 1.2), 360) : 0;
    const investigationBonus = state.investigatedPanels.length * 40;
    const thoroughnessBonus = state.investigatedPanels.length >= PANELS.length ? 120 : 0;
    const basePoints = isCorrect ? 500 : 0;
    const total = basePoints + timeBonus + investigationBonus + thoroughnessBonus;

    const breakdown = {
      base: basePoints,
      time: timeBonus,
      investigation: investigationBonus,
      thoroughness: thoroughnessBonus,
      total,
      isCorrect,
    };

    setState(prev => {
      const newTotal = prev.totalScore + total;
      if (newTotal > highScore) saveHighScore(newTotal);
      return {
        ...prev,
        gamePhase: 'outcome',
        isTimerRunning: false,
        decision,
        scenarioScore: total,
        scoreBreakdown: breakdown,
        totalScore: newTotal,
        completedScenarios: [
          ...prev.completedScenarios,
          { scenarioIndex: prev.currentScenarioIndex, decision, isCorrect, score: total },
        ],
      };
    });
  }, [currentScenario, state.timer, state.investigatedPanels, highScore]);

  const continueGame = useCallback(() => {
    setState(prev => ({ ...prev, gamePhase: 'intro' }));
  }, []);

  const resetGame = useCallback(() => {
    clearInterval(timerRef.current);
    setState(INITIAL_STATE);
  }, []);

  const allScenariosComplete = state.completedScenarios.length >= scenarios.length;

  const isScenarioCompleted = useCallback(
    (index) => state.completedScenarios.some(c => c.scenarioIndex === index),
    [state.completedScenarios]
  );

  return {
    ...state,
    currentScenario,
    highScore,
    allScenariosComplete,
    isScenarioCompleted,
    addLog,
    startScenario,
    investigatePanel,
    makeDecision,
    continueGame,
    resetGame,
  };
}

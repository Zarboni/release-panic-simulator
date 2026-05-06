import { useState, useEffect } from 'react';
import { scenarios, getRankForScore } from '../data/scenarios';

const BOOT_LINES = [
  { text: 'QA TERMINAL v2.4.1 INITIALISING...', delay: 0,    level: 'dim' },
  { text: 'Loading incident database.............. OK', delay: 300,  level: 'ok' },
  { text: 'Loading test result parser............. OK', delay: 550,  level: 'ok' },
  { text: 'Loading bug tracker connector.......... OK', delay: 750,  level: 'ok' },
  { text: 'Loading CI pipeline monitor............ OK', delay: 950,  level: 'ok' },
  { text: 'Loading risk assessment engine......... OK', delay: 1150, level: 'ok' },
  { text: '──────────────────────────────────────────', delay: 1350, level: 'dim' },
  { text: 'WELCOME, QA ENGINEER.', delay: 1500, level: 'bright' },
  { text: 'A release is imminent. Chaos is inevitable.', delay: 1750, level: 'dim' },
  { text: 'Can you make the right call before it ships?', delay: 2000, level: 'dim' },
];

const DIFFICULTY_STYLES = {
  MEDIUM: { color: 'text-terminal-amber', badge: 'border-terminal-amber text-terminal-amber' },
  HARD:   { color: 'text-terminal-red',   badge: 'border-terminal-red text-terminal-red' },
  EASY:   { color: 'text-terminal-green', badge: 'border-terminal-green text-terminal-green' },
};

const DIFF_COLOR = {
  green: 'text-terminal-green',
  red: 'text-terminal-red',
  amber: 'text-terminal-amber',
};

function RiskBar({ score, color }) {
  const pct = score;
  const barColor = color === 'red' ? 'bg-terminal-red' : color === 'amber' ? 'bg-terminal-amber' : 'bg-terminal-green';
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-terminal-green-dark">
        <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs-mono ${DIFF_COLOR[color] || 'text-terminal-text'}`}>{score}/100</span>
    </div>
  );
}

export default function IntroScreen({ onStart, totalScore, completedScenarios, isScenarioCompleted, highScore }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let t;
    function showNext(i) {
      if (i >= BOOT_LINES.length) {
        setTimeout(() => setReady(true), 400);
        return;
      }
      t = setTimeout(() => {
        setVisibleLines(i + 1);
        showNext(i + 1);
      }, i === 0 ? BOOT_LINES[0].delay : BOOT_LINES[i].delay - BOOT_LINES[i - 1].delay);
    }
    showNext(0);
    return () => clearTimeout(t);
  }, []);

  const rank = getRankForScore(totalScore);

  return (
    <div className="min-h-screen bg-terminal-bg p-4 md:p-8 font-mono crt-flicker">
      <div className="max-w-3xl mx-auto">

        {/* ASCII Title */}
        <div className="text-center mb-6">
          <div className="font-pixel text-terminal-green text-glow leading-loose" style={{ fontSize: 'clamp(10px, 2.5vw, 18px)' }}>
            <div>RELEASE PANIC</div>
            <div>SIMULATOR</div>
          </div>
          <div className="text-terminal-text-dim text-xs-mono mt-2">
            A QA Engineer Portfolio Project · Built by Faiz Carstens
          </div>
        </div>

        {/* Boot sequence */}
        <div className="border border-terminal-border bg-black p-4 mb-6 min-h-[160px]">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`text-xs-mono leading-relaxed ${
                line.level === 'ok'     ? 'text-terminal-green' :
                line.level === 'bright' ? 'text-terminal-text text-glow-sm font-bold' :
                line.level === 'dim'    ? 'text-terminal-text-dim' :
                                          'text-terminal-text'
              }`}
            >
              {line.text}
            </div>
          ))}
          {visibleLines < BOOT_LINES.length && (
            <span className="text-terminal-green animate-blink">█</span>
          )}
        </div>

        {/* Score display */}
        {totalScore > 0 && (
          <div className="border border-terminal-green-dim bg-terminal-green-dark p-3 mb-4 flex items-center gap-4">
            <div>
              <div className="text-terminal-text-dim text-xs font-pixel">SESSION SCORE</div>
              <div className="text-terminal-green text-xl-mono text-glow">{totalScore}</div>
            </div>
            <div className="border-l border-terminal-border pl-4">
              <div className="text-terminal-text-dim text-xs font-pixel">QA RANK</div>
              <div className="text-terminal-green text-sm-mono">{rank.emoji} {rank.rank}</div>
            </div>
            {highScore > 0 && (
              <div className="border-l border-terminal-border pl-4 ml-auto">
                <div className="text-terminal-text-dim text-xs font-pixel">HIGH SCORE</div>
                <div className="text-terminal-text text-sm-mono">{highScore}</div>
              </div>
            )}
          </div>
        )}

        {/* Scenario selection */}
        {ready && (
          <div className="animate-slide-up">
            <div className="font-pixel text-terminal-green text-xs mb-3">SELECT SCENARIO</div>
            <div className="space-y-2">
              {scenarios.map((s, index) => {
                const completed = isScenarioCompleted(index);
                const diffStyle = DIFFICULTY_STYLES[s.difficulty] || DIFFICULTY_STYLES.MEDIUM;
                return (
                  <button
                    key={s.id}
                    onClick={() => onStart(index)}
                    className={`w-full text-left border px-4 py-3 transition-all hover:bg-terminal-green-dark group ${
                      completed
                        ? 'border-terminal-green-dim bg-terminal-green-dark opacity-75'
                        : 'border-terminal-border hover:border-terminal-green'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`font-pixel text-xs mt-0.5 ${completed ? 'text-terminal-green' : 'text-terminal-text-dim'}`}>
                        {completed ? '✓' : `0${index + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-pixel text-xs group-hover:text-terminal-green ${completed ? 'text-terminal-green' : 'text-terminal-text'}`}>
                            {s.title}
                          </span>
                          <span className={`text-xs font-pixel px-1 border ${diffStyle.badge}`} style={{ fontSize: '7px' }}>
                            {s.difficulty}
                          </span>
                          {completed && (
                            <span className="text-terminal-green text-xs-mono">COMPLETED</span>
                          )}
                        </div>
                        <div className="text-terminal-text-dim text-xs-mono mt-0.5">{s.subtitle}</div>
                        <div className="text-terminal-text-dim text-xs-mono mt-1 leading-snug">
                          {s.context[0]}
                        </div>
                        <RiskBar score={s.riskScore} color={s.difficultyColor} />
                      </div>
                      <span className="text-terminal-green text-lg-mono opacity-0 group-hover:opacity-100 transition-opacity shrink-0">→</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* How to play */}
            <div className="border border-terminal-border mt-6 p-4">
              <div className="font-pixel text-terminal-text-dim text-xs mb-3">HOW TO PLAY</div>
              <div className="space-y-1 text-xs-mono text-terminal-text-dim">
                <div>▶ You are the QA engineer. A release is pending. The clock is ticking.</div>
                <div>▶ Open each panel to investigate: test results, bug tracker, CI pipeline, and risk score.</div>
                <div>▶ Based on what you find, make one of four decisions.</div>
                <div>▶ Your score depends on: correct decision, speed, and whether you reviewed all evidence.</div>
                <div>▶ There is always a correct answer. Real QA instincts will help you find it.</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1 text-xs-mono">
                <div className="text-terminal-green">✓ APPROVE RELEASE — ship it</div>
                <div className="text-terminal-red">⛔ BLOCK RELEASE — hold it</div>
                <div className="text-terminal-amber">🔧 REQUEST HOTFIX — fix first</div>
                <div className="text-terminal-cyan">📞 ESCALATE — get a human</div>
              </div>
            </div>

            <div className="text-center mt-4 text-terminal-text-dim text-xs-mono">
              Built with React + Tailwind CSS · github.com/FaizCarstens ·{' '}
              <span className="text-terminal-green">v1.0.0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

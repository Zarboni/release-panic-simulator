import { useMemo } from 'react';
import TestResultsPanel from './panels/TestResultsPanel';
import BugTrackerPanel from './panels/BugTrackerPanel';
import PipelinePanel from './panels/PipelinePanel';
import RiskMeter from './panels/RiskMeter';
import TerminalLog from './TerminalLog';
import DecisionPanel from './DecisionPanel';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function CountdownTimer({ seconds, timeLimit }) {
  const pct = timeLimit > 0 ? seconds / timeLimit : 0;
  const isUrgent = seconds < 60;
  const isCritical = seconds < 30;

  return (
    <div className={`flex items-center gap-2 ${isCritical ? 'animate-blink' : ''}`}>
      <span className="text-terminal-text-dim text-xs font-pixel">TIME</span>
      <span className={`font-pixel text-sm ${
        isCritical ? 'text-terminal-red text-glow-red' :
        isUrgent   ? 'text-terminal-amber text-glow-amber' :
                     'text-terminal-green'
      }`}>
        {formatTime(seconds)}
      </span>
      <div className="w-16 h-2 bg-terminal-green-dark">
        <div
          className={`h-full transition-all ${
            isCritical ? 'bg-terminal-red' :
            isUrgent   ? 'bg-terminal-amber' :
                         'bg-terminal-green'
          }`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard({
  scenario,
  timer,
  investigatedPanels,
  terminalLogs,
  onInvestigate,
  onDecide,
}) {
  const investigated = useMemo(() => ({
    tests:    investigatedPanels.includes('tests'),
    bugs:     investigatedPanels.includes('bugs'),
    pipeline: investigatedPanels.includes('pipeline'),
    risk:     investigatedPanels.includes('risk'),
  }), [investigatedPanels]);

  const openCriticalCount = scenario.bugs.filter(
    b => b.severity === 'CRITICAL' && b.status === 'OPEN'
  ).length;

  return (
    <div className="h-screen flex flex-col bg-terminal-bg font-mono overflow-hidden">

      {/* Header */}
      <header className="border-b border-terminal-border bg-terminal-panel px-4 py-2 flex items-center gap-4 shrink-0 flex-wrap gap-y-2">
        <div className="flex items-center gap-3">
          <span className="font-pixel text-terminal-green text-glow" style={{ fontSize: '9px' }}>
            RELEASE PANIC
          </span>
          <span className="text-terminal-text-dim text-xs-mono">//</span>
          <span className="text-terminal-cyan text-xs-mono">{scenario.subtitle}</span>
        </div>

        {openCriticalCount > 0 && (
          <div className="flex items-center gap-1 animate-blink">
            <span className="text-terminal-red text-xs font-pixel" style={{ fontSize: '8px' }}>
              ⚠ {openCriticalCount} CRITICAL OPEN
            </span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-4 flex-wrap">
          <CountdownTimer seconds={timer} timeLimit={scenario.timeLimit} />
          <div className="text-terminal-text-dim text-xs-mono">
            RISK: <span className={`${
              scenario.riskScore >= 70 ? 'text-terminal-red text-glow-red' :
              scenario.riskScore >= 40 ? 'text-terminal-amber' :
                                          'text-terminal-green'
            }`}>{scenario.riskScore}/100</span>
          </div>
          <div className="text-terminal-text-dim text-xs-mono">
            <span className="text-terminal-text">{investigatedPanels.length}</span>/4 reviewed
          </div>
        </div>
      </header>

      {/* Context banner */}
      <div className="px-4 py-2 border-b border-terminal-border bg-black flex items-start gap-2 shrink-0">
        <span className="text-terminal-amber shrink-0 text-xs-mono">CONTEXT:</span>
        <div className="flex flex-wrap gap-x-6 gap-y-0.5">
          {scenario.context.map((line, i) => (
            <span key={i} className="text-terminal-text-dim text-xs-mono">{line}</span>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0">

        {/* Left column */}
        <div className="border-r border-terminal-border overflow-y-auto p-3 space-y-3 min-h-0">
          <TestResultsPanel
            scenario={scenario}
            onInvestigate={onInvestigate}
            investigated={investigated.tests}
          />
          <PipelinePanel
            scenario={scenario}
            onInvestigate={onInvestigate}
            investigated={investigated.pipeline}
          />
          <RiskMeter
            scenario={scenario}
            onInvestigate={onInvestigate}
            investigated={investigated.risk}
          />
        </div>

        {/* Right column */}
        <div className="overflow-y-auto p-3 space-y-3 min-h-0 flex flex-col">
          <BugTrackerPanel
            scenario={scenario}
            onInvestigate={onInvestigate}
            investigated={investigated.bugs}
          />
          <div className="flex-1 min-h-[200px]">
            <TerminalLog logs={terminalLogs} />
          </div>
        </div>
      </div>

      {/* Decision bar */}
      <div className="border-t border-terminal-border shrink-0">
        <DecisionPanel
          onDecide={onDecide}
          investigatedCount={investigatedPanels.length}
        />
      </div>
    </div>
  );
}

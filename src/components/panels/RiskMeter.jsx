import { useState } from 'react';

function getRiskLevel(score) {
  if (score >= 80) return { label: 'CRITICAL RISK', color: 'text-terminal-red', glow: 'text-glow-red', border: 'border-terminal-red', bg: 'bg-terminal-red-dark' };
  if (score >= 60) return { label: 'HIGH RISK',     color: 'text-terminal-amber', glow: 'text-glow-amber', border: 'border-terminal-amber', bg: 'bg-terminal-amber-dark' };
  if (score >= 40) return { label: 'MEDIUM RISK',   color: 'text-terminal-yellow', glow: '', border: 'border-yellow-700', bg: 'bg-yellow-950' };
  if (score >= 20) return { label: 'LOW RISK',      color: 'text-terminal-green', glow: '', border: 'border-terminal-green-dim', bg: 'bg-terminal-green-dark' };
  return               { label: 'MINIMAL RISK',  color: 'text-terminal-green', glow: 'text-glow', border: 'border-terminal-green-dim', bg: 'bg-terminal-green-dark' };
}

const RISK_FACTORS = [
  { key: 'criticalBugs',   label: 'Critical open bugs',      calc: s => s.bugs.filter(b => b.severity === 'CRITICAL' && b.status === 'OPEN').length, perUnit: '+30 pts each' },
  { key: 'majorBugs',      label: 'Major open bugs',         calc: s => s.bugs.filter(b => b.severity === 'MAJOR'    && b.status === 'OPEN').length, perUnit: '+15 pts each' },
  { key: 'failedTests',    label: 'Test failures',            calc: s => s.testResults.failed, perUnit: 'scaled' },
  { key: 'pipelineFails',  label: 'Pipeline stage failures',  calc: s => s.pipeline.stages.filter(st => st.status === 'FAIL').length, perUnit: '+20 pts each' },
  { key: 'coverageLow',    label: 'Coverage below threshold', calc: s => s.testResults.coverage < 80 ? 1 : 0, perUnit: '+10 pts' },
];

export default function RiskMeter({ scenario, onInvestigate, investigated }) {
  const [open, setOpen] = useState(false);
  const { riskScore } = scenario;
  const level = getRiskLevel(riskScore);

  const segments = 20;
  const filledSegments = Math.round((riskScore / 100) * segments);

  function handleOpen() {
    if (!open) onInvestigate('risk');
    setOpen(o => !o);
  }

  return (
    <div className={`panel-bg border ${investigated ? 'border-terminal-green-dim' : 'border-terminal-border'} ${riskScore >= 60 ? 'border-glow-red' : 'border-glow'}`}>
      <button
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-terminal-green-dark transition-colors"
        onClick={handleOpen}
      >
        <span className={`text-lg-mono ${level.color} ${riskScore >= 70 ? 'animate-blink' : ''}`}>◈</span>
        <span className="font-pixel text-terminal-green text-xs">RISK ASSESSMENT</span>
        <div className="ml-auto flex items-center gap-3">
          <span className={`text-xl-mono font-mono ${level.color} ${level.glow}`}>{riskScore}</span>
          <span className={`text-xs font-pixel px-1 py-0.5 border ${level.border} ${level.bg} ${level.color}`}>
            {level.label}
          </span>
          {investigated && <span className="text-terminal-green text-xs">✓</span>}
          <span className="text-terminal-text-dim">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          {/* Gauge bar */}
          <div className="mb-4">
            <div className="flex gap-0.5 mb-1">
              {Array.from({ length: segments }, (_, i) => {
                const filled = i < filledSegments;
                const pct = ((i + 1) / segments) * 100;
                const segColor = pct <= 40 ? 'bg-terminal-green' : pct <= 65 ? 'bg-terminal-amber' : 'bg-terminal-red';
                return (
                  <div
                    key={i}
                    className={`flex-1 h-6 ${filled ? segColor : 'bg-terminal-green-dark'} transition-all`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-terminal-text-dim text-xs-mono">
              <span>0</span>
              <span className="text-terminal-green">LOW</span>
              <span className="text-terminal-amber">MEDIUM</span>
              <span className="text-terminal-red">CRITICAL</span>
              <span>100</span>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="border border-terminal-border p-3 mb-3">
            <div className="font-pixel text-terminal-text-dim text-xs mb-2">RISK FACTORS</div>
            {RISK_FACTORS.map(factor => {
              const count = factor.calc(scenario);
              const hasIssue = count > 0;
              return (
                <div key={factor.key} className="flex items-center gap-2 text-xs-mono mb-1">
                  <span className={hasIssue ? 'text-terminal-red' : 'text-terminal-green'}>{hasIssue ? '▲' : '✓'}</span>
                  <span className={`flex-1 ${hasIssue ? 'text-terminal-text' : 'text-terminal-text-dim'}`}>{factor.label}</span>
                  <span className={`${hasIssue ? level.color : 'text-terminal-text-dim'}`}>
                    {count > 0 ? `${count} × (${factor.perUnit})` : 'none'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recommendation */}
          <div className={`border ${level.border} ${level.bg} p-3`}>
            <div className="font-pixel text-xs mb-1" style={{ color: 'inherit' }}>
              <span className={level.color}>AUTOMATED RECOMMENDATION</span>
            </div>
            <p className={`text-xs-mono ${level.color}`}>
              {riskScore >= 80
                ? 'Risk score is CRITICAL. Recommend blocking release pending resolution of open critical bugs and pipeline failures.'
                : riskScore >= 60
                ? 'Risk score is HIGH. Multiple significant issues detected. Escalation or hotfix strongly recommended before release.'
                : riskScore >= 40
                ? 'Risk score is MODERATE. Some issues present but may be acceptable depending on priority and context.'
                : 'Risk score is LOW. System appears stable. Standard sign-off process recommended.'}
            </p>
            <p className="text-terminal-text-dim text-xs-mono mt-1">
              * Automated risk scores are advisory only. Human judgement required.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

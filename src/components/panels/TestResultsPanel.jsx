import { useState } from 'react';

const STATUS_STYLES = {
  PASS:    { badge: 'badge-pass',    icon: '●', label: 'PASS' },
  FAIL:    { badge: 'badge-fail',    icon: '✖', label: 'FAIL' },
  WARN:    { badge: 'badge-warn',    icon: '▲', label: 'WARN' },
  BLOCKED: { badge: 'badge-blocked', icon: '◼', label: 'BLOCKED' },
};

function SeverityBar({ passed, failed, total }) {
  const passW = total > 0 ? (passed / total) * 100 : 0;
  const failW = total > 0 ? (failed / total) * 100 : 0;
  return (
    <div className="flex h-1.5 rounded-sm overflow-hidden bg-terminal-green-dark w-full">
      <div style={{ width: `${passW}%` }} className="bg-terminal-green" />
      <div style={{ width: `${failW}%` }} className="bg-terminal-red" />
    </div>
  );
}

function SuiteRow({ suite }) {
  const [open, setOpen] = useState(false);
  const s = STATUS_STYLES[suite.status] || STATUS_STYLES.WARN;
  const total = suite.passed + suite.failed;
  const hasFailures = suite.failures?.length > 0;
  const hasWarnings = suite.warnings?.length > 0;

  return (
    <div className="border border-terminal-border mb-1">
      <button
        className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-terminal-green-dark transition-colors"
        onClick={() => { if (hasFailures || hasWarnings || suite.note) setOpen(o => !o); }}
      >
        <span className={`text-xs px-1 py-0.5 font-pixel ${s.badge}`}>{s.label}</span>
        <span className="flex-1 text-terminal-text text-sm-mono truncate">{suite.name}</span>
        <span className="text-terminal-text-dim text-xs-mono ml-auto shrink-0">
          <span className="text-terminal-green">{suite.passed}</span>
          {suite.failed > 0 && <span className="text-terminal-red">/{suite.failed}F</span>}
          <span className="text-terminal-text-dim ml-1">{suite.duration}</span>
        </span>
        {(hasFailures || hasWarnings || suite.note) && (
          <span className="text-terminal-text-dim text-xs ml-1">{open ? '▲' : '▼'}</span>
        )}
      </button>
      {open && (
        <div className="px-3 pb-2 border-t border-terminal-border bg-black bg-opacity-30">
          {suite.note && (
            <p className="text-terminal-amber text-xs-mono mt-2 mb-1">ℹ {suite.note}</p>
          )}
          {suite.warnings?.map((w, i) => (
            <div key={i} className="mt-1 text-terminal-amber text-xs-mono">⚠ {w}</div>
          ))}
          {suite.failures?.map((f, i) => (
            <div key={i} className="mt-2">
              <div className="text-terminal-red text-xs-mono">✖ {f.test}</div>
              <div className="text-terminal-text-dim text-xs-mono ml-3 mt-0.5 font-mono">{f.error}</div>
            </div>
          ))}
          {suite.additionalFailures > 0 && (
            <div className="text-terminal-text-dim text-xs-mono mt-2">
              + {suite.additionalFailures} more failures not shown
            </div>
          )}
          <div className="mt-2">
            <SeverityBar passed={suite.passed} failed={suite.failed} total={total} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestResultsPanel({ scenario, onInvestigate, investigated }) {
  const [open, setOpen] = useState(false);
  const { testResults } = scenario;
  const passRate = Math.round((testResults.passed / testResults.totalTests) * 100);
  const coverageOk = testResults.coverage >= 80;

  function handleOpen() {
    if (!open) onInvestigate('tests');
    setOpen(o => !o);
  }

  return (
    <div className={`panel-bg border-glow ${investigated ? 'border-terminal-green-dim' : 'border-terminal-border'} border`}>
      <button
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-terminal-green-dark transition-colors"
        onClick={handleOpen}
      >
        <span className="text-terminal-green text-lg-mono">◈</span>
        <span className="font-pixel text-terminal-green text-xs">TEST RESULTS</span>
        <div className="ml-auto flex items-center gap-3">
          <span className={`text-xs-mono ${passRate >= 95 ? 'text-terminal-green' : passRate >= 80 ? 'text-terminal-amber' : 'text-terminal-red'}`}>
            {passRate}% pass
          </span>
          <span className={`text-xs px-1 py-0.5 font-pixel ${
            testResults.failed > 20 ? 'badge-fail' : testResults.failed > 0 ? 'badge-warn' : 'badge-pass'
          }`}>
            {testResults.failed > 0 ? `${testResults.failed}F` : 'OK'}
          </span>
          {investigated && <span className="text-terminal-green text-xs">✓</span>}
          <span className="text-terminal-text-dim">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          {/* Summary row */}
          <div className="grid grid-cols-4 gap-2 mb-3 text-center">
            {[
              { label: 'TOTAL', value: testResults.totalTests, color: 'text-terminal-text' },
              { label: 'PASS', value: testResults.passed, color: 'text-terminal-green' },
              { label: 'FAIL', value: testResults.failed, color: testResults.failed > 0 ? 'text-terminal-red' : 'text-terminal-green' },
              { label: 'SKIP', value: testResults.skipped, color: 'text-terminal-text-dim' },
            ].map(({ label, value, color }) => (
              <div key={label} className="border border-terminal-border py-2">
                <div className={`text-lg-mono ${color}`}>{value}</div>
                <div className="text-terminal-text-dim text-xs font-pixel">{label}</div>
              </div>
            ))}
          </div>

          {/* Coverage */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-terminal-text-dim text-xs-mono">COVERAGE:</span>
            <div className="flex-1 h-2 bg-terminal-green-dark">
              <div
                style={{ width: `${testResults.coverage}%` }}
                className={`h-full ${coverageOk ? 'bg-terminal-green' : 'bg-terminal-amber'}`}
              />
            </div>
            <span className={`text-xs-mono font-mono ${coverageOk ? 'text-terminal-green' : 'text-terminal-amber'}`}>
              {testResults.coverage}%{!coverageOk && ' ⚠ below threshold'}
            </span>
          </div>

          {/* Suites */}
          <div>
            {testResults.suites.map((suite, i) => (
              <SuiteRow key={i} suite={suite} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

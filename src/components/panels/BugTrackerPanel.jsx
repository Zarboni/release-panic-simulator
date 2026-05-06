import { useState } from 'react';

const SEV_STYLES = {
  CRITICAL: { badge: 'badge-critical', sort: 0 },
  MAJOR:    { badge: 'badge-major',    sort: 1 },
  MINOR:    { badge: 'badge-minor',    sort: 2 },
};

const STATUS_STYLES = {
  OPEN:        'text-terminal-red',
  IN_PROGRESS: 'text-terminal-amber',
  RESOLVED:    'text-terminal-green',
  CLOSED:      'text-terminal-text-dim',
};

function BugRow({ bug }) {
  const [open, setOpen] = useState(false);
  const sev = SEV_STYLES[bug.severity] || SEV_STYLES.MINOR;
  const statusColor = STATUS_STYLES[bug.status] || 'text-terminal-text-dim';

  return (
    <div className={`border mb-1 ${
      bug.severity === 'CRITICAL' && bug.status === 'OPEN'
        ? 'border-terminal-red border-glow-red'
        : 'border-terminal-border'
    }`}>
      <button
        className="w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-terminal-green-dark transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className={`text-xs px-1 py-0.5 font-pixel shrink-0 mt-0.5 ${sev.badge}`}>
          {bug.severity === 'CRITICAL' ? 'CRIT' : bug.severity}
        </span>
        <span className="flex-1 text-terminal-text text-sm-mono leading-tight">{bug.title}</span>
        <div className="flex items-center gap-2 shrink-0 ml-1">
          <span className={`text-xs-mono font-mono ${statusColor}`}>{bug.status.replace('_', ' ')}</span>
          <span className="text-terminal-text-dim text-xs-mono">{bug.id}</span>
          <span className="text-terminal-text-dim text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-terminal-border bg-black bg-opacity-30 animate-fade-in">
          <p className="text-terminal-text text-xs-mono mt-2 leading-relaxed">{bug.description}</p>
          {bug.steps && (
            <div className="mt-2">
              <span className="text-terminal-text-dim text-xs font-pixel">STEPS TO REPRODUCE:</span>
              <div className="mt-1">
                {bug.steps.map((s, i) => (
                  <div key={i} className="text-terminal-text-dim text-xs-mono">{s}</div>
                ))}
              </div>
            </div>
          )}
          {bug.note && (
            <div className={`mt-2 text-xs-mono ${bug.severity === 'CRITICAL' ? 'text-terminal-red' : 'text-terminal-amber'}`}>
              ⚠ NOTE: {bug.note}
            </div>
          )}
          <div className="mt-2 grid grid-cols-2 gap-x-4 text-xs-mono">
            <span className="text-terminal-text-dim">Reporter: <span className="text-terminal-text">{bug.reporter}</span></span>
            <span className="text-terminal-text-dim">Assignee: <span className="text-terminal-text">{bug.assignee}</span></span>
            <span className="text-terminal-text-dim">Component: <span className="text-terminal-text">{bug.component}</span></span>
            <span className="text-terminal-text-dim">Created: <span className="text-terminal-text">{bug.created}</span></span>
          </div>
          {bug.linkedTest && (
            <div className="mt-1 text-terminal-cyan text-xs-mono">🔗 Linked: {bug.linkedTest}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BugTrackerPanel({ scenario, onInvestigate, investigated }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const { bugs } = scenario;

  const counts = {
    CRITICAL: bugs.filter(b => b.severity === 'CRITICAL' && b.status !== 'RESOLVED').length,
    MAJOR:    bugs.filter(b => b.severity === 'MAJOR'    && b.status !== 'RESOLVED').length,
    MINOR:    bugs.filter(b => b.severity === 'MINOR'    && b.status !== 'RESOLVED').length,
  };

  const sorted = [...bugs].sort((a, b) =>
    (SEV_STYLES[a.severity]?.sort ?? 9) - (SEV_STYLES[b.severity]?.sort ?? 9)
  );

  const visible = filter === 'ALL' ? sorted : sorted.filter(b => b.severity === filter);

  function handleOpen() {
    if (!open) onInvestigate('bugs');
    setOpen(o => !o);
  }

  const hasOpenCritical = counts.CRITICAL > 0;

  return (
    <div className={`panel-bg border ${investigated ? 'border-terminal-green-dim' : 'border-terminal-border'} ${hasOpenCritical ? 'border-glow-red' : 'border-glow'}`}>
      <button
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-terminal-green-dark transition-colors"
        onClick={handleOpen}
      >
        <span className={`text-lg-mono ${hasOpenCritical ? 'text-terminal-red animate-blink' : 'text-terminal-green'}`}>◈</span>
        <span className="font-pixel text-terminal-green text-xs">BUG TRACKER</span>
        <div className="ml-auto flex items-center gap-2">
          {counts.CRITICAL > 0 && (
            <span className="badge-critical text-xs px-1 py-0.5 font-pixel animate-blink-fast">
              {counts.CRITICAL} CRIT
            </span>
          )}
          {counts.MAJOR > 0 && (
            <span className="badge-major text-xs px-1 py-0.5 font-pixel">{counts.MAJOR} MAJ</span>
          )}
          {counts.MINOR > 0 && (
            <span className="badge-minor text-xs px-1 py-0.5 font-pixel">{counts.MINOR} MIN</span>
          )}
          {investigated && <span className="text-terminal-green text-xs">✓</span>}
          <span className="text-terminal-text-dim">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          {/* Filter tabs */}
          <div className="flex gap-1 mb-3">
            {['ALL', 'CRITICAL', 'MAJOR', 'MINOR'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-pixel px-2 py-1 border transition-colors ${
                  filter === f
                    ? 'border-terminal-green text-terminal-green bg-terminal-green-dark'
                    : 'border-terminal-border text-terminal-text-dim hover:border-terminal-green-dim'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="text-terminal-green text-sm-mono">✓ No {filter !== 'ALL' ? filter.toLowerCase() : ''} bugs.</p>
          ) : (
            visible.map(bug => <BugRow key={bug.id} bug={bug} />)
          )}
        </div>
      )}
    </div>
  );
}

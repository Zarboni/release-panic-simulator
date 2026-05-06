import { useState } from 'react';

const STAGE_STYLES = {
  PASS:    { icon: '✓', color: 'text-terminal-green', border: 'border-terminal-green-dim',    bg: 'bg-terminal-green-dark' },
  FAIL:    { icon: '✖', color: 'text-terminal-red',   border: 'border-terminal-red',          bg: 'bg-terminal-red-dark',   glow: true },
  WARN:    { icon: '▲', color: 'text-terminal-amber', border: 'border-terminal-amber',        bg: 'bg-terminal-amber-dark' },
  BLOCKED: { icon: '◼', color: 'text-terminal-text-dim', border: 'border-terminal-border', bg: 'bg-black' },
};

function PipelineStage({ stage, index, total }) {
  const [open, setOpen] = useState(false);
  const s = STAGE_STYLES[stage.status] || STAGE_STYLES.BLOCKED;
  const isLast = index === total - 1;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setOpen(o => !o)}
        className={`relative flex flex-col items-center justify-center w-full border ${s.border} ${s.bg} px-2 py-2 transition-all hover:opacity-80 ${s.glow ? 'border-glow-red' : ''}`}
      >
        <span className={`text-lg-mono ${s.color} ${s.glow ? 'animate-blink' : ''}`}>{s.icon}</span>
        <span className={`text-xs font-pixel ${s.color} text-center leading-tight mt-1`} style={{ fontSize: '7px' }}>
          {stage.name}
        </span>
        <span className="text-terminal-text-dim text-xs-mono mt-1" style={{ fontSize: '12px' }}>{stage.duration}</span>
      </button>

      {!isLast && (
        <div className={`w-px h-3 ${stage.status === 'PASS' ? 'bg-terminal-green-dim' : stage.status === 'BLOCKED' ? 'bg-terminal-border' : 'bg-terminal-amber'}`} />
      )}

      {open && (
        <div className={`w-full border ${s.border} ${s.bg} px-2 py-1 text-xs-mono`}>
          <span className={s.color}>{stage.details}</span>
        </div>
      )}
    </div>
  );
}

export default function PipelinePanel({ scenario, onInvestigate, investigated }) {
  const [open, setOpen] = useState(false);
  const { pipeline } = scenario;

  const failCount  = pipeline.stages.filter(s => s.status === 'FAIL').length;
  const warnCount  = pipeline.stages.filter(s => s.status === 'WARN').length;
  const blockCount = pipeline.stages.filter(s => s.status === 'BLOCKED').length;

  const overallStatus = failCount > 0 || blockCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';

  function handleOpen() {
    if (!open) onInvestigate('pipeline');
    setOpen(o => !o);
  }

  return (
    <div className={`panel-bg border ${investigated ? 'border-terminal-green-dim' : 'border-terminal-border'} ${overallStatus === 'FAIL' ? 'border-glow-red' : 'border-glow'}`}>
      <button
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-terminal-green-dark transition-colors"
        onClick={handleOpen}
      >
        <span className={`text-lg-mono ${overallStatus === 'FAIL' ? 'text-terminal-red' : overallStatus === 'WARN' ? 'text-terminal-amber' : 'text-terminal-green'}`}>◈</span>
        <span className="font-pixel text-terminal-green text-xs">CI PIPELINE</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-terminal-text-dim text-xs-mono">{pipeline.branch}</span>
          <span className={`text-xs px-1 py-0.5 font-pixel ${
            overallStatus === 'FAIL' ? 'badge-fail' : overallStatus === 'WARN' ? 'badge-warn' : 'badge-pass'
          }`}>
            {overallStatus}
          </span>
          {investigated && <span className="text-terminal-green text-xs">✓</span>}
          <span className="text-terminal-text-dim">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          {/* Meta */}
          <div className="flex gap-4 mb-4 text-xs-mono text-terminal-text-dim border-b border-terminal-border pb-2">
            <span>Commit: <span className="text-terminal-cyan">{pipeline.commit}</span></span>
            <span>By: <span className="text-terminal-text">{pipeline.triggeredBy}</span></span>
            <span>At: <span className="text-terminal-text">{pipeline.startedAt}</span></span>
          </div>

          {/* Visual pipeline */}
          <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${pipeline.stages.length}, 1fr)` }}>
            {pipeline.stages.map((stage, i) => (
              <PipelineStage key={stage.name} stage={stage} index={i} total={pipeline.stages.length} />
            ))}
          </div>

          {/* Stage details list */}
          <div className="mt-3 space-y-1">
            {pipeline.stages.map(stage => {
              const s = STAGE_STYLES[stage.status] || STAGE_STYLES.BLOCKED;
              return (
                <div key={stage.name} className={`flex gap-2 text-xs-mono border-l-2 pl-2 ${
                  stage.status === 'FAIL' ? 'border-terminal-red' :
                  stage.status === 'WARN' ? 'border-terminal-amber' :
                  stage.status === 'PASS' ? 'border-terminal-green-dim' : 'border-terminal-border'
                }`}>
                  <span className={`${s.color} w-5 shrink-0`}>{s.icon}</span>
                  <span className="text-terminal-text-dim w-24 shrink-0">{stage.name}</span>
                  <span className={s.color}>{stage.details}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

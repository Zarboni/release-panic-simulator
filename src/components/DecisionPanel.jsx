import { useState } from 'react';
import { DECISIONS, DECISION_META } from '../data/scenarios';

const BUTTON_STYLES = {
  green: {
    base: 'border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg',
    glow: 'hover:border-glow',
  },
  red: {
    base: 'border-terminal-red text-terminal-red hover:bg-terminal-red hover:text-white',
    glow: 'hover:border-glow-red',
  },
  amber: {
    base: 'border-terminal-amber text-terminal-amber hover:bg-terminal-amber hover:text-terminal-bg',
    glow: 'hover:border-glow-amber',
  },
  cyan: {
    base: 'border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-terminal-bg',
    glow: '',
  },
};

export default function DecisionPanel({ onDecide, investigatedCount }) {
  const [confirm, setConfirm] = useState(null);
  const allInvestigated = investigatedCount >= 4;

  function handleClick(key) {
    setConfirm(key);
  }

  function handleConfirm() {
    if (confirm) {
      onDecide(confirm);
      setConfirm(null);
    }
  }

  if (confirm) {
    const meta = DECISION_META[confirm];
    const style = BUTTON_STYLES[meta.color];
    return (
      <div className="panel-bg border border-terminal-border p-4 animate-slide-up">
        <div className="text-center mb-4">
          <div className="font-pixel text-terminal-amber text-xs mb-2">⚠ CONFIRM YOUR CALL</div>
          <div className={`text-xl-mono ${style.base.split(' ')[1]} font-mono`}>
            {meta.icon} {meta.label}
          </div>
          <div className="text-terminal-text-dim text-sm-mono mt-1">{meta.description}</div>
          {!allInvestigated && (
            <div className="text-terminal-amber text-xs-mono mt-2 animate-blink">
              ⚠ Warning: You have not reviewed all panels ({investigatedCount}/4 opened)
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleConfirm}
            className={`font-pixel text-xs px-4 py-3 border-2 transition-all ${style.base} ${style.glow}`}
          >
            CONFIRM — {meta.label}
          </button>
          <button
            onClick={() => setConfirm(null)}
            className="font-pixel text-xs px-4 py-3 border border-terminal-border text-terminal-text-dim hover:border-terminal-green-dim hover:text-terminal-text transition-colors"
          >
            ← CANCEL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-bg border border-terminal-border p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-pixel text-terminal-green text-xs">YOUR CALL</span>
        {!allInvestigated && (
          <span className="text-terminal-amber text-xs-mono ml-auto">
            ⚠ {investigatedCount}/4 panels reviewed
          </span>
        )}
        {allInvestigated && (
          <span className="text-terminal-green text-xs-mono ml-auto">✓ All panels reviewed</span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(DECISIONS).map(([key, value]) => {
          const meta = DECISION_META[value];
          const style = BUTTON_STYLES[meta.color];
          return (
            <button
              key={key}
              onClick={() => handleClick(value)}
              className={`flex flex-col items-center justify-center gap-1 border-2 px-3 py-3 transition-all font-pixel text-center ${style.base} ${style.glow}`}
            >
              <span className="text-xl-mono">{meta.icon}</span>
              <span className="text-xs leading-tight" style={{ fontSize: '8px' }}>{meta.label}</span>
              <span className="text-xs-mono font-mono opacity-60" style={{ fontSize: '11px' }}>[{meta.shortKey}]</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

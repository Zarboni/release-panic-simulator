import { useEffect, useRef } from 'react';

const LEVEL_STYLES = {
  INFO:    'log-info',
  WARN:    'log-warn',
  ERROR:   'log-error',
  DEBUG:   'log-debug',
  SUCCESS: 'log-success',
};

const LEVEL_PREFIX = {
  INFO:    '  INFO',
  WARN:    '  WARN',
  ERROR:   ' ERROR',
  DEBUG:   ' DEBUG',
  SUCCESS: '    OK',
};

export default function TerminalLog({ logs }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="panel-bg border border-terminal-border border-glow flex flex-col h-full min-h-0">
      <div className="px-4 py-3 border-b border-terminal-border flex items-center gap-3 shrink-0">
        <span className="text-terminal-green text-lg-mono">◈</span>
        <span className="font-pixel text-terminal-green text-xs">TERMINAL LOG</span>
        <span className="ml-auto text-terminal-text-dim text-xs-mono">{logs.length} entries</span>
        <span className="text-terminal-green animate-blink">█</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs-mono">
        {logs.length === 0 ? (
          <p className="text-terminal-text-dim">Initialising...</p>
        ) : (
          logs.map(log => (
            <div key={log.id} className="flex gap-2 mb-0.5 leading-snug">
              <span className="text-terminal-text-dim shrink-0">[{log.time}]</span>
              <span className={`${LEVEL_STYLES[log.level] || 'log-info'} shrink-0 w-14`}>
                {LEVEL_PREFIX[log.level] || '  INFO'}
              </span>
              <span className={`${LEVEL_STYLES[log.level] || 'log-info'} flex-1`}>{log.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

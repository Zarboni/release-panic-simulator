import { DECISION_META, DECISIONS, scenarios } from '../data/scenarios';

const SEVERITY_STYLES = {
  CATASTROPHIC: { color: 'text-terminal-red',   border: 'border-terminal-red',   glow: 'text-glow-red',   bg: 'bg-terminal-red-dark' },
  BAD:          { color: 'text-terminal-amber',  border: 'border-terminal-amber', glow: 'text-glow-amber', bg: 'bg-terminal-amber-dark' },
  OKAY:         { color: 'text-terminal-yellow', border: 'border-yellow-700',     glow: '',                bg: 'bg-yellow-950' },
  SUCCESS:      { color: 'text-terminal-green',  border: 'border-terminal-green', glow: 'text-glow',       bg: 'bg-terminal-green-dark' },
};

export default function OutcomeScreen({
  scenario,
  decision,
  scoreBreakdown,
  totalScore,
  completedScenarios,
  onContinue,
  onReplay,
  onResetGame,
}) {
  const isTimeout = decision === 'timeout';
  const consequence = isTimeout ? null : scenario.consequences[decision];
  const correctMeta = DECISION_META[scenario.correctDecision];
  const decisionMeta = isTimeout ? null : DECISION_META[decision];

  const sev = consequence ? SEVERITY_STYLES[consequence.severity] : SEVERITY_STYLES.BAD;
  const isCorrect = !isTimeout && decision === scenario.correctDecision;

  const allScenariosPlayed = completedScenarios.length >= scenarios.length;
  const remainingScenarios = scenarios.filter(
    (_, i) => !completedScenarios.some(c => c.scenarioIndex === i)
  );

  return (
    <div className="min-h-screen bg-terminal-bg p-4 md:p-6 font-mono animate-fade-in">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className={`border-2 ${sev.border} ${sev.bg} p-4 mb-4 text-center`}>
          {isTimeout ? (
            <>
              <div className="font-pixel text-terminal-red text-sm mb-2 animate-blink">⏰ TIME EXPIRED</div>
              <div className="text-terminal-red text-xl-mono">RELEASE SHIPPED WITHOUT QA SIGN-OFF</div>
              <div className="text-terminal-text-dim text-sm-mono mt-1">You ran out of time. The release went out as-is.</div>
            </>
          ) : (
            <>
              <div className={`text-3xl-mono mb-1 ${sev.glow} ${sev.color}`}>{consequence.emoji}</div>
              <div className={`font-pixel text-sm mb-1 ${sev.color}`}>{consequence.title}</div>
              <div className={`text-lg-mono ${sev.color} ${sev.glow}`}>
                {isCorrect ? '✓ CORRECT DECISION' : '✖ WRONG CALL'}
              </div>
            </>
          )}
        </div>

        {/* Your decision vs correct */}
        {!isTimeout && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`border p-3 ${isCorrect ? 'border-terminal-green bg-terminal-green-dark' : 'border-terminal-red bg-terminal-red-dark'}`}>
              <div className="font-pixel text-xs text-terminal-text-dim mb-1">YOUR CALL</div>
              <div className={`text-sm-mono ${isCorrect ? 'text-terminal-green' : 'text-terminal-red'}`}>
                {decisionMeta.icon} {decisionMeta.label}
              </div>
            </div>
            <div className={`border p-3 ${isCorrect ? 'border-terminal-green bg-terminal-green-dark' : 'border-terminal-amber bg-terminal-amber-dark'}`}>
              <div className="font-pixel text-xs text-terminal-text-dim mb-1">CORRECT ANSWER</div>
              <div className="text-sm-mono text-terminal-green">
                {correctMeta.icon} {correctMeta.label}
              </div>
            </div>
          </div>
        )}

        {/* Story */}
        {consequence && (
          <div className="border border-terminal-border panel-bg p-4 mb-4">
            <div className="font-pixel text-terminal-text-dim text-xs mb-3">OUTCOME NARRATIVE</div>
            <div className="space-y-1">
              {consequence.story.map((line, i) => (
                <div
                  key={i}
                  className={`text-sm-mono ${
                    line.startsWith('"') ? 'text-terminal-cyan italic' : 'text-terminal-text'
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {i === 0 ? '▶ ' : '  '}{line}
                </div>
              ))}
            </div>
            <div className={`mt-4 border-t border-terminal-border pt-3`}>
              <div className="font-pixel text-xs text-terminal-text-dim mb-1">LESSON</div>
              <p className={`text-sm-mono ${sev.color}`}>{consequence.lesson}</p>
            </div>
          </div>
        )}

        {/* Score breakdown */}
        {scoreBreakdown && (
          <div className="border border-terminal-border panel-bg p-4 mb-4">
            <div className="font-pixel text-terminal-green text-xs mb-3">SCORE BREAKDOWN</div>
            <div className="space-y-1 text-sm-mono">
              {[
                { label: 'Correct decision', value: scoreBreakdown.base, active: scoreBreakdown.base > 0 },
                { label: 'Time bonus', value: scoreBreakdown.time, active: scoreBreakdown.time > 0 },
                { label: 'Investigation bonus', value: scoreBreakdown.investigation, note: '(panels opened)' },
                { label: 'Thoroughness bonus', value: scoreBreakdown.thoroughness, note: '(all 4 panels)' },
              ].map(({ label, value, note, active }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-4 ${value > 0 ? 'text-terminal-green' : 'text-terminal-text-dim'}`}>
                    {value > 0 ? '▶' : '·'}
                  </span>
                  <span className={`flex-1 ${value > 0 ? 'text-terminal-text' : 'text-terminal-text-dim'}`}>
                    {label} {note && <span className="text-terminal-text-dim">{note}</span>}
                  </span>
                  <span className={`${value > 0 ? 'text-terminal-green' : 'text-terminal-text-dim'}`}>
                    +{value}
                  </span>
                </div>
              ))}
              <div className="border-t border-terminal-border pt-2 mt-2 flex items-center gap-2">
                <span className="text-terminal-green w-4">▶</span>
                <span className="flex-1 font-pixel text-xs text-terminal-green">SCENARIO SCORE</span>
                <span className="text-terminal-green text-xl-mono text-glow">{scoreBreakdown.total}</span>
              </div>
              <div className="flex items-center gap-2 text-terminal-text-dim">
                <span className="w-4" />
                <span className="flex-1 font-pixel text-xs">TOTAL SCORE</span>
                <span className="text-terminal-text text-lg-mono">{totalScore}</span>
              </div>
            </div>
          </div>
        )}

        {/* Timeout score — zero */}
        {isTimeout && (
          <div className="border border-terminal-red bg-terminal-red-dark p-4 mb-4 text-center">
            <div className="font-pixel text-terminal-red text-xs mb-1">SCORE THIS ROUND</div>
            <div className="text-3xl-mono text-terminal-red text-glow-red">0</div>
            <div className="text-terminal-text-dim text-xs-mono mt-1">Time ran out. No points awarded.</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!allScenariosPlayed && remainingScenarios.length > 0 && (
            <button
              onClick={onContinue}
              className="font-pixel text-xs px-4 py-3 border-2 border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-all border-glow"
            >
              → NEXT SCENARIO
            </button>
          )}
          <button
            onClick={onReplay}
            className="font-pixel text-xs px-4 py-3 border border-terminal-amber text-terminal-amber hover:bg-terminal-amber hover:text-terminal-bg transition-all"
          >
            ↺ REPLAY THIS SCENARIO
          </button>
          <button
            onClick={onContinue}
            className="font-pixel text-xs px-4 py-3 border border-terminal-border text-terminal-text-dim hover:border-terminal-green-dim hover:text-terminal-text transition-colors"
          >
            ← SCENARIO SELECT
          </button>
          {allScenariosPlayed && (
            <button
              onClick={onResetGame}
              className="font-pixel text-xs px-4 py-3 border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-terminal-bg transition-all"
            >
              ⟳ NEW GAME
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

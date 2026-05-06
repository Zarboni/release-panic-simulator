import IntroScreen from './components/IntroScreen';
import Dashboard from './components/Dashboard';
import OutcomeScreen from './components/OutcomeScreen';
import { useGameState } from './hooks/useGameState';

export default function App() {
  const game = useGameState();

  if (game.gamePhase === 'intro') {
    return (
      <IntroScreen
        onStart={game.startScenario}
        totalScore={game.totalScore}
        completedScenarios={game.completedScenarios}
        isScenarioCompleted={game.isScenarioCompleted}
        highScore={game.highScore}
      />
    );
  }

  if (game.gamePhase === 'playing' && game.currentScenario) {
    return (
      <Dashboard
        scenario={game.currentScenario}
        timer={game.timer}
        investigatedPanels={game.investigatedPanels}
        terminalLogs={game.terminalLogs}
        onInvestigate={game.investigatePanel}
        onDecide={game.makeDecision}
      />
    );
  }

  if (game.gamePhase === 'outcome' && game.currentScenario) {
    return (
      <OutcomeScreen
        scenario={game.currentScenario}
        decision={game.decision}
        scoreBreakdown={game.scoreBreakdown}
        totalScore={game.totalScore}
        completedScenarios={game.completedScenarios}
        onContinue={game.continueGame}
        onReplay={() => game.startScenario(game.currentScenarioIndex)}
        onResetGame={game.resetGame}
      />
    );
  }

  return null;
}

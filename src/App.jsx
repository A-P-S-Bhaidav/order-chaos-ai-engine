import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import RulesModal from './components/RulesModal';
import RoundEndModal from './components/RoundEndModal';
import GameOverModal from './components/GameOverModal';

function AppContent() {
  const { state } = useGame();

  return (
    <>
      <div className="bg-decoration" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      {state.gamePhase === 'menu' && <HomePage />}
      {(state.gamePhase === 'playing' || state.gamePhase === 'round-end') && <GamePage />}

      {/* Modals */}
      {state.showRules && <RulesModal />}
      {state.gamePhase === 'round-end' && <RoundEndModal />}
      {state.gamePhase === 'game-over' && <GameOverModal />}
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

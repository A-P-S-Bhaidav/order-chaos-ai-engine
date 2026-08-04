import React from 'react';
import { useGame } from '../context/GameContext';
import Board from './Board';
import SymbolSelector from './SymbolSelector';
import { countStraightN } from '../engine/gameLogic';

export default function GamePage() {
  const { state, dispatch, isHumanTurn, getHumanRoleForRound } = useGame();
  const humanRole = getHumanRoleForRound(state.currentRound);
  const aiRole = humanRole === 'order' ? 'chaos' : 'order';

  const straight4s = countStraightN(state.board, 4);

  return (
    <div className="game">
      {/* Header */}
      <div className="game__header">
        <button
          className="game__back-btn"
          onClick={() => dispatch({ type: 'RESET' })}
          id="back-to-menu"
        >
          ← Menu
        </button>
        <span className="badge badge--round game__round-badge">
          Round {state.currentRound} / 2
        </span>
        <button
          className="game__rules-btn"
          onClick={() => dispatch({ type: 'TOGGLE_RULES' })}
          id="game-rules-btn"
        >
          📖 Rules
        </button>
      </div>

      {/* Player Info */}
      <div className="game-info">
        <div className={`game-info__player ${isHumanTurn && !state.aiThinking ? 'game-info__player--active' : ''}`}>
          <span className="game-info__player-label">You</span>
          <span className="game-info__player-role">
            <span className={`badge badge--${humanRole}`}>
              {humanRole === 'order' ? '🎯 Order' : '🌀 Chaos'}
            </span>
          </span>
        </div>
        <span className="game-info__vs">VS</span>
        <div className={`game-info__player ${!isHumanTurn || state.aiThinking ? 'game-info__player--active' : ''}`}>
          <span className="game-info__player-label">AI Bot</span>
          <span className="game-info__player-role">
            <span className={`badge badge--${aiRole}`}>
              {aiRole === 'order' ? '🎯 Order' : '🌀 Chaos'}
            </span>
          </span>
        </div>
      </div>

      {/* Turn Indicator */}
      <div className={`game-info__turn-indicator ${state.aiThinking ? 'game-info__turn-indicator--thinking' : ''}`}>
        {state.aiThinking ? (
          <span>🤖 AI is thinking... <span className="spinner"></span></span>
        ) : isHumanTurn ? (
          <span>Your turn — pick a symbol and place it!</span>
        ) : (
          <span>AI's turn...</span>
        )}
      </div>

      {/* Symbol Selector */}
      {isHumanTurn && !state.aiThinking && (
        <SymbolSelector />
      )}

      {/* Board */}
      <div className="board-container">
        <Board />
      </div>

      {/* Stats */}
      <div className="game-stats">
        <div className="game-stats__item">
          <span className="game-stats__value">{state.moveCount}</span>
          <span className="game-stats__label">Moves</span>
        </div>
        <div className="game-stats__item">
          <span className="game-stats__value">{straight4s}</span>
          <span className="game-stats__label">Straight 4s</span>
        </div>
        <div className="game-stats__item">
          <span className="game-stats__value" style={{ textTransform: 'capitalize' }}>
            {state.difficulty}
          </span>
          <span className="game-stats__label">Difficulty</span>
        </div>
      </div>
    </div>
  );
}

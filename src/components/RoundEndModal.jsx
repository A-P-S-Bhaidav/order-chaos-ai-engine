import React from 'react';
import { useGame } from '../context/GameContext';

export default function RoundEndModal() {
  const { state, dispatch } = useGame();
  const result = state.roundResults[state.roundResults.length - 1];
  if (!result) return null;

  const orderWon = result.winner === 'order';

  const handleNext = () => {
    if (state.currentRound === 1) {
      dispatch({ type: 'NEXT_ROUND' });
    } else {
      dispatch({ type: 'FINISH_GAME' });
    }
  };

  return (
    <div className="modal-overlay" id="round-end-overlay">
      <div className="modal">
        <div className="round-end">
          <h2 className="modal__title">
            Round {state.currentRound} Complete!
          </h2>

          <div className={`round-end__result ${orderWon ? 'round-end__result--order-wins' : 'round-end__result--chaos-wins'}`}>
            {orderWon ? '🎯 Order Wins!' : '🌀 Chaos Wins!'}
            {orderWon
              ? ` Five-in-a-row achieved in ${result.moveCount} moves!`
              : ` Board filled — no five-in-a-row formed.`
            }
          </div>

          <div className="round-end__stats">
            <div className="round-end__stat">
              <div className="round-end__stat-value">{result.moveCount}</div>
              <div className="round-end__stat-label">Total Moves</div>
            </div>
            <div className="round-end__stat">
              <div className="round-end__stat-value">{result.straight4s}</div>
              <div className="round-end__stat-label">Straight 4s</div>
            </div>
            <div className="round-end__stat">
              <div className="round-end__stat-value">{result.straight5 ? '✅' : '❌'}</div>
              <div className="round-end__stat-label">Straight 5</div>
            </div>
            <div className="round-end__stat">
              <div className="round-end__stat-value">{result.winner === 'order' ? '🎯' : '🌀'}</div>
              <div className="round-end__stat-label">Winner</div>
            </div>
          </div>

          {state.currentRound === 1 && (
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
              Roles will swap for Round 2. Your new role will be{' '}
              <strong style={{ color: state.humanRole === 'order' ? 'var(--color-chaos)' : 'var(--color-order)' }}>
                {state.humanRole === 'order' ? 'Chaos' : 'Order'}
              </strong>.
            </p>
          )}

          <button className="btn btn--primary btn--lg" onClick={handleNext} id="next-round-btn">
            {state.currentRound === 1 ? '⚔️ Start Round 2' : '🏆 See Final Results'}
          </button>
        </div>
      </div>
    </div>
  );
}

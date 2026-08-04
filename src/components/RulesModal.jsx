import React from 'react';
import { useGame } from '../context/GameContext';

export default function RulesModal() {
  const { dispatch } = useGame();

  return (
    <div className="modal-overlay" onClick={() => dispatch({ type: 'TOGGLE_RULES' })} id="rules-modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal__close"
          onClick={() => dispatch({ type: 'TOGGLE_RULES' })}
          id="close-rules"
          aria-label="Close rules"
        >
          ✕
        </button>
        <h2 className="modal__title heading-gradient">📖 Game Rules</h2>

        <div className="rules">
          {/* Overview */}
          <div className="rules__section">
            <h3 className="rules__section-title">Game Overview</h3>
            <ul className="rules__list">
              <li className="rules__list-item">
                Order and Chaos is a two-player strategy game played on a 6×6 grid.
              </li>
              <li className="rules__list-item">
                The game is played over two rounds, with players alternating roles.
              </li>
              <li className="rules__list-item">
                One player represents <strong style={{color: 'var(--color-order)'}}>Order</strong>, the other plays as <strong style={{color: 'var(--color-chaos)'}}>Chaos</strong>.
              </li>
            </ul>
          </div>

          {/* Gameplay */}
          <div className="rules__section">
            <h3 className="rules__section-title">Gameplay</h3>
            <ul className="rules__list">
              <li className="rules__list-item">
                The <strong style={{color: 'var(--color-order)'}}>Order</strong> player goes first in each round.
              </li>
              <li className="rules__list-item">
                Players alternate turns, placing either an <strong style={{color: 'var(--color-x)'}}>X</strong> or an <strong style={{color: 'var(--color-o)'}}>O</strong> in any empty cell.
              </li>
              <li className="rules__list-item">
                Both players can use either symbol on any turn — this is what makes it strategic!
              </li>
            </ul>
          </div>

          {/* Objectives */}
          <div className="rules__section">
            <h3 className="rules__section-title">Objectives</h3>
            <ul className="rules__list">
              <li className="rules__list-item">
                <strong style={{color: 'var(--color-order)'}}>Order's Goal:</strong> Create a straight line of 5 matching symbols (all Xs or all Os) in a row, column, or diagonal.
              </li>
              <li className="rules__list-item">
                <strong style={{color: 'var(--color-chaos)'}}>Chaos's Goal:</strong> Fill the entire board without allowing any line of 5 identical symbols to form.
              </li>
            </ul>
          </div>

          {/* Patterns */}
          <div className="rules__section">
            <h3 className="rules__section-title">Pattern Definitions</h3>
            <div className="rules__pattern-card">
              <div className="rules__pattern-visual">
                {['X', 'X', 'X', 'X', 'X'].map((s, i) => (
                  <span key={i} className="rules__pattern-cell rules__pattern-cell--x">{s}</span>
                ))}
              </div>
              <div className="rules__pattern-info">
                <h4>Straight 5</h4>
                <p>Five identical symbols in a continuous line — Order wins!</p>
              </div>
            </div>
            <div className="rules__pattern-card">
              <div className="rules__pattern-visual">
                {['O', 'O', 'O', 'O'].map((s, i) => (
                  <span key={i} className="rules__pattern-cell rules__pattern-cell--o">{s}</span>
                ))}
              </div>
              <div className="rules__pattern-info">
                <h4>Straight 4</h4>
                <p>Four identical symbols in a line — used as a tiebreaker.</p>
              </div>
            </div>
          </div>

          {/* Two Rounds */}
          <div className="rules__section">
            <h3 className="rules__section-title">Two-Round Match</h3>
            <ul className="rules__list">
              <li className="rules__list-item">
                After Round 1, players swap roles and the board resets.
              </li>
              <li className="rules__list-item">
                Round 2 plays out the same way with reversed roles.
              </li>
            </ul>
          </div>

          {/* Winning */}
          <div className="rules__section">
            <h3 className="rules__section-title">Winning the Game</h3>
            <ul className="rules__list">
              <li className="rules__list-item">
                <strong>If Round 1's Order achieved 5-in-a-row:</strong> Round 2's Order must do it in fewer moves to win. Same moves → compare straight 4s. Same 4s → Draw.
              </li>
              <li className="rules__list-item">
                <strong>If Round 1's Order failed:</strong> Round 2's Order wins by achieving any 5-in-a-row. If neither succeeds, compare straight 4s. Same 4s → Draw.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

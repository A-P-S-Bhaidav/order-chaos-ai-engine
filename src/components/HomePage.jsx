import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export default function HomePage() {
  const { dispatch } = useGame();
  const [selectedRole, setSelectedRole] = useState('order');
  const [selectedDifficulty, setSelectedDifficulty] = useState('hard');

  const handleStart = () => {
    dispatch({
      type: 'START_GAME',
      humanRole: selectedRole,
      difficulty: selectedDifficulty,
    });
  };

  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__logo">
          <span className="home__logo-symbol home__logo-symbol--x">X</span>
          <span className="home__logo-symbol home__logo-symbol--o">O</span>
        </div>
        <h1 className="heading-display heading-gradient home__title">
          Order & Chaos
        </h1>
        <p className="home__subtitle">
          A strategic 6×6 board game of pattern and disruption. 
          Outsmart the AI — play as Order or Chaos.
        </p>
      </div>

      <div className="home__options">
        {/* Role Selection */}
        <div className="role-select">
          <span className="role-select__label">Choose Your Starting Role</span>
          <div className="role-select__cards">
            <button
              className={`role-card role-card--order ${selectedRole === 'order' ? 'role-card--selected' : ''}`}
              onClick={() => setSelectedRole('order')}
              id="role-order"
            >
              <span className="role-card__icon">🎯</span>
              <span className="role-card__title" style={{ color: 'var(--color-order)' }}>Order</span>
              <span className="role-card__desc">Create a line of 5 matching symbols</span>
            </button>
            <button
              className={`role-card role-card--chaos ${selectedRole === 'chaos' ? 'role-card--selected' : ''}`}
              onClick={() => setSelectedRole('chaos')}
              id="role-chaos"
            >
              <span className="role-card__icon">🌀</span>
              <span className="role-card__title" style={{ color: 'var(--color-chaos)' }}>Chaos</span>
              <span className="role-card__desc">Prevent any line of 5 from forming</span>
            </button>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="difficulty-select">
          <span className="role-select__label">AI Difficulty</span>
          <div className="difficulty-select__options">
            {['easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                className={`difficulty-btn ${selectedDifficulty === d ? 'difficulty-btn--selected' : ''}`}
                onClick={() => setSelectedDifficulty(d)}
                id={`difficulty-${d}`}
              >
                {d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Medium' : '🔴 Hard'}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="home__actions">
          <button className="btn btn--primary btn--lg" onClick={handleStart} id="start-game">
            ⚔️ Start Game
          </button>
          <div className="home__nav-links">
            <button
              className="home__nav-link"
              onClick={() => dispatch({ type: 'TOGGLE_RULES' })}
              id="view-rules"
            >
              📖 View Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

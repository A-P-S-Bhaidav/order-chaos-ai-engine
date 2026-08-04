import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#6366f1', '#a855f7', '#22d3ee', '#f59e0b', '#34d399', '#f472b6', '#ec4899'];
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 6 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function GameOverModal() {
  const { state, dispatch } = useGame();
  const { roundResults, overallWinner, humanRole } = state;

  if (roundResults.length < 2) return null;

  const r1 = roundResults[0];
  const r2 = roundResults[1];

  const winnerText = overallWinner === 'player'
    ? '🎉 You Win!'
    : overallWinner === 'ai'
    ? '🤖 AI Wins!'
    : '🤝 It\'s a Draw!';

  const subtitleText = overallWinner === 'player'
    ? 'Outstanding strategy! You outsmarted the AI.'
    : overallWinner === 'ai'
    ? 'The AI proved too clever this time. Try again?'
    : 'An evenly matched battle of wits!';

  const r1OrderLabel = humanRole === 'order' ? 'You (Order)' : 'AI (Order)';
  const r2OrderLabel = humanRole === 'order' ? 'AI (Order)' : 'You (Order)';

  return (
    <div className="modal-overlay" id="game-over-overlay">
      {overallWinner === 'player' && <Confetti />}
      <div className="modal">
        <div className="game-over">
          <h2 className={`game-over__winner game-over__winner--${overallWinner}`}>
            {winnerText}
          </h2>
          <p className="game-over__subtitle">{subtitleText}</p>

          <div className="game-over__comparison">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Round 1</th>
                  <th>Round 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Order Player</td>
                  <td>{r1OrderLabel}</td>
                  <td>{r2OrderLabel}</td>
                </tr>
                <tr>
                  <td>Result</td>
                  <td className={r1.winner === 'order' ? 'comparison-table__highlight' : ''}>
                    {r1.winner === 'order' ? '🎯 Order Won' : '🌀 Chaos Won'}
                  </td>
                  <td className={r2.winner === 'order' ? 'comparison-table__highlight' : ''}>
                    {r2.winner === 'order' ? '🎯 Order Won' : '🌀 Chaos Won'}
                  </td>
                </tr>
                <tr>
                  <td>Moves</td>
                  <td>{r1.moveCount}</td>
                  <td>{r2.moveCount}</td>
                </tr>
                <tr>
                  <td>Straight 5</td>
                  <td>{r1.straight5 ? '✅ Yes' : '❌ No'}</td>
                  <td>{r2.straight5 ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr>
                  <td>Straight 4s</td>
                  <td>{r1.straight4s}</td>
                  <td>{r2.straight4s}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            className="btn btn--primary btn--lg"
            onClick={() => dispatch({ type: 'RESET' })}
            id="play-again-btn"
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

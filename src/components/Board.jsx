import React from 'react';
import { useGame } from '../context/GameContext';

export default function Board() {
  const { state, humanMakeMove, isHumanTurn } = useGame();
  const { board, lastMove, winningCells, aiThinking, gamePhase } = state;

  const isWinningCell = (row, col) => {
    if (!winningCells) return false;
    return winningCells.some((c) => c.row === row && c.col === col);
  };

  const isLastMove = (row, col) => {
    if (!lastMove) return false;
    return lastMove.row === row && lastMove.col === col;
  };

  const disabled = !isHumanTurn || aiThinking || gamePhase !== 'playing';

  return (
    <div className={`board ${disabled ? 'board--disabled' : ''}`} id="game-board">
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <button
            key={`${rIdx}-${cIdx}`}
            className={`cell 
              ${cell ? 'cell--filled' : ''} 
              ${disabled ? 'cell--disabled' : ''} 
              ${isLastMove(rIdx, cIdx) ? 'cell--last-move' : ''} 
              ${isWinningCell(rIdx, cIdx) ? 'cell--winning' : ''}
            `}
            onClick={() => {
              if (!cell && !disabled) {
                humanMakeMove(rIdx, cIdx);
              }
            }}
            disabled={!!cell || disabled}
            id={`cell-${rIdx}-${cIdx}`}
            aria-label={`Cell row ${rIdx + 1}, column ${cIdx + 1}${cell ? `, contains ${cell}` : ', empty'}`}
          >
            {cell ? (
              <span className={`cell__symbol cell__symbol--${cell.toLowerCase()}`}>
                {cell}
              </span>
            ) : (
              !disabled && isHumanTurn && (
                <span className={`cell__preview cell__symbol--${state.selectedSymbol.toLowerCase()}`}>
                  {state.selectedSymbol}
                </span>
              )
            )}
          </button>
        ))
      )}
    </div>
  );
}

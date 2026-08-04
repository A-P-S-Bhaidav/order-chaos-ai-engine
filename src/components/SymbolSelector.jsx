import React from 'react';
import { useGame } from '../context/GameContext';

export default function SymbolSelector() {
  const { state, dispatch } = useGame();

  return (
    <div className="symbol-selector" id="symbol-selector">
      <span className="symbol-selector__label">Place:</span>
      <div className="symbol-selector__buttons">
        <button
          className={`symbol-btn symbol-btn--x ${state.selectedSymbol === 'X' ? 'symbol-btn--selected' : ''}`}
          onClick={() => dispatch({ type: 'SET_SYMBOL', symbol: 'X' })}
          id="select-x"
          aria-label="Select X symbol"
        >
          X
        </button>
        <button
          className={`symbol-btn symbol-btn--o ${state.selectedSymbol === 'O' ? 'symbol-btn--selected' : ''}`}
          onClick={() => dispatch({ type: 'SET_SYMBOL', symbol: 'O' })}
          id="select-o"
          aria-label="Select O symbol"
        >
          O
        </button>
      </div>
    </div>
  );
}

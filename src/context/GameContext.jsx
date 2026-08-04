import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { createBoard, placeMove, checkWin, isBoardFull, countStraightN } from '../engine/gameLogic';

const GameContext = createContext(null);

const INITIAL_STATE = {
  gamePhase: 'menu', // 'menu' | 'playing' | 'round-end' | 'game-over'
  currentRound: 1,
  board: createBoard(),
  currentPlayer: 'order', // order always goes first
  humanRole: 'order', // which role the human plays in round 1
  moveCount: 0,
  selectedSymbol: 'X',
  aiThinking: false,
  difficulty: 'hard',
  lastMove: null,
  winningCells: null,
  roundResults: [], // { winner, moveCount, straight4s, straight5 }
  moveHistory: [],
  showRules: false,
  overallWinner: null, // 'player' | 'ai' | 'draw'
};

function getHumanRoleForRound(humanFirstRole, round) {
  if (round === 1) return humanFirstRole;
  return humanFirstRole === 'order' ? 'chaos' : 'order';
}

function isHumanTurn(state) {
  const humanRole = getHumanRoleForRound(state.humanRole, state.currentRound);
  return state.currentPlayer === humanRole;
}

function determineOverallWinner(results, humanFirstRole) {
  // results[0] = round 1, results[1] = round 2
  const r1 = results[0];
  const r2 = results[1];

  // Round 1: humanFirstRole was Order, opponent was Chaos
  // Round 2: humanFirstRole is Chaos, opponent is Order
  // For determining winner, we compare the Order performance of each round

  // Player 1 = human's role in R1, Player 2 = human's role in R2
  // R1 Order = human if humanFirstRole=order, else AI
  // R2 Order = AI if humanFirstRole=order, else human

  const r1OrderIsHuman = humanFirstRole === 'order';

  if (r1.straight5) {
    // Round 1 Order achieved 5-in-a-row
    if (r2.straight5) {
      // Both achieved 5-in-a-row, compare moves
      if (r1.moveCount < r2.moveCount) {
        return r1OrderIsHuman ? 'player' : 'ai';
      } else if (r2.moveCount < r1.moveCount) {
        return r1OrderIsHuman ? 'ai' : 'player';
      } else {
        // Same moves, compare straight 4s
        if (r1.straight4s > r2.straight4s) {
          return r1OrderIsHuman ? 'player' : 'ai';
        } else if (r2.straight4s > r1.straight4s) {
          return r1OrderIsHuman ? 'ai' : 'player';
        }
        return 'draw';
      }
    } else {
      // R1 Order won, R2 Order didn't
      return r1OrderIsHuman ? 'player' : 'ai';
    }
  } else {
    // R1 Order did NOT achieve 5-in-a-row
    if (r2.straight5) {
      // R2 Order wins by completing
      return r1OrderIsHuman ? 'ai' : 'player';
    } else {
      // Neither achieved 5-in-a-row, compare straight 4s
      if (r1.straight4s > r2.straight4s) {
        return r1OrderIsHuman ? 'player' : 'ai';
      } else if (r2.straight4s > r1.straight4s) {
        return r1OrderIsHuman ? 'ai' : 'player';
      }
      return 'draw';
    }
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      return {
        ...INITIAL_STATE,
        gamePhase: 'playing',
        humanRole: action.humanRole,
        difficulty: action.difficulty,
        board: createBoard(),
      };
    }

    case 'PLACE_MOVE': {
      const { row, col, symbol } = action;
      const newBoard = placeMove(state.board, row, col, symbol);
      const newMoveCount = state.moveCount + 1;
      const winResult = checkWin(newBoard);
      const full = isBoardFull(newBoard);

      const newHistory = [...state.moveHistory, { row, col, symbol, player: state.currentPlayer }];

      if (winResult.won) {
        // Order wins this round
        const straight4s = countStraightN(newBoard, 4);
        return {
          ...state,
          board: newBoard,
          moveCount: newMoveCount,
          lastMove: { row, col },
          winningCells: winResult.cells,
          moveHistory: newHistory,
          gamePhase: 'round-end',
          roundResults: [...state.roundResults, {
            winner: 'order',
            moveCount: newMoveCount,
            straight4s,
            straight5: true,
          }],
        };
      }

      if (full) {
        // Chaos wins this round
        const straight4s = countStraightN(newBoard, 4);
        return {
          ...state,
          board: newBoard,
          moveCount: newMoveCount,
          lastMove: { row, col },
          moveHistory: newHistory,
          gamePhase: 'round-end',
          roundResults: [...state.roundResults, {
            winner: 'chaos',
            moveCount: newMoveCount,
            straight4s,
            straight5: false,
          }],
        };
      }

      return {
        ...state,
        board: newBoard,
        moveCount: newMoveCount,
        lastMove: { row, col },
        currentPlayer: state.currentPlayer === 'order' ? 'chaos' : 'order',
        moveHistory: newHistory,
      };
    }

    case 'SET_SYMBOL': {
      return { ...state, selectedSymbol: action.symbol };
    }

    case 'SET_AI_THINKING': {
      return { ...state, aiThinking: action.thinking };
    }

    case 'NEXT_ROUND': {
      return {
        ...state,
        currentRound: 2,
        board: createBoard(),
        currentPlayer: 'order',
        moveCount: 0,
        selectedSymbol: 'X',
        aiThinking: false,
        lastMove: null,
        winningCells: null,
        moveHistory: [],
        gamePhase: 'playing',
      };
    }

    case 'FINISH_GAME': {
      const winner = determineOverallWinner(state.roundResults, state.humanRole);
      return {
        ...state,
        gamePhase: 'game-over',
        overallWinner: winner,
      };
    }

    case 'TOGGLE_RULES': {
      return { ...state, showRules: !state.showRules };
    }

    case 'RESET': {
      return { ...INITIAL_STATE };
    }

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const workerRef = useRef(null);

  // Initialize web worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../engine/aiWorker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      const { move } = e.data;
      if (move) {
        dispatch({ type: 'PLACE_MOVE', row: move.row, col: move.col, symbol: move.symbol });
      }
      dispatch({ type: 'SET_AI_THINKING', thinking: false });
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const humanMakeMove = useCallback((row, col) => {
    if (state.aiThinking || state.gamePhase !== 'playing') return;
    if (!isHumanTurn(state)) return;

    dispatch({ type: 'PLACE_MOVE', row, col, symbol: state.selectedSymbol });
  }, [state]);

  const triggerAI = useCallback(() => {
    if (state.gamePhase !== 'playing') return;
    if (isHumanTurn(state)) return;

    const aiRole = getHumanRoleForRound(state.humanRole, state.currentRound) === 'order' ? 'chaos' : 'order';
    dispatch({ type: 'SET_AI_THINKING', thinking: true });

    if (workerRef.current) {
      workerRef.current.postMessage({
        board: state.board,
        aiRole,
        difficulty: state.difficulty,
      });
    }
  }, [state]);

  // Trigger AI when it's AI's turn
  useEffect(() => {
    if (state.gamePhase === 'playing' && !isHumanTurn(state) && !state.aiThinking) {
      const timer = setTimeout(() => triggerAI(), 400);
      return () => clearTimeout(timer);
    }
  }, [state.currentPlayer, state.gamePhase, state.aiThinking, triggerAI]);

  const value = {
    state,
    dispatch,
    humanMakeMove,
    isHumanTurn: isHumanTurn(state),
    getHumanRoleForRound: (round) => getHumanRoleForRound(state.humanRole, round),
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}

import { createBoard, cloneBoard, placeMove, getValidMoves, isBoardFull, checkWin, countStraightN, getAllLines } from './gameLogic.js';

const BOARD_SIZE = 6;

// Difficulty levels control search depth
const DIFFICULTY = {
  easy: 2,
  medium: 3,
  hard: 4
};

/**
 * Gets the best move using Minimax with Alpha-Beta pruning.
 * @param {Array<Array<string|null>>} board - The current board state.
 * @param {string} aiRole - 'order' or 'chaos'.
 * @param {string} difficulty - 'easy', 'medium', or 'hard'.
 * @returns {{row: number, col: number, symbol: string}} The best move.
 */
export function getBestMove(board, aiRole, difficulty = 'hard') {
  const depth = DIFFICULTY[difficulty] || 4;
  const isMaximizing = aiRole === 'order'; 
  
  let bestMove = null;
  let bestScore = isMaximizing ? -Infinity : Infinity;
  
  const moves = generateOrderedMoves(board, aiRole);
  
  for (const move of moves) {
    const newBoard = placeMove(board, move.row, move.col, move.symbol);
    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, !isMaximizing, aiRole);
    
    if (isMaximizing) {
      if (score > bestScore) { bestScore = score; bestMove = move; }
    } else {
      if (score < bestScore) { bestScore = score; bestMove = move; }
    }
  }
  
  // Fallback if no best move found (should not happen)
  if (!bestMove && moves.length > 0) bestMove = moves[0];
  
  return bestMove;
}

/**
 * Minimax algorithm with alpha-beta pruning.
 * @param {Array<Array<string|null>>} board - Current board state
 * @param {number} depth - Remaining search depth
 * @param {number} alpha - Alpha value for pruning
 * @param {number} beta - Beta value for pruning
 * @param {boolean} isMaximizing - True if current turn is Order's
 * @param {string} aiRole - The role the AI is playing ('order' or 'chaos')
 * @returns {number} The evaluated score
 */
function minimax(board, depth, alpha, beta, isMaximizing, aiRole) {
  const winResult = checkWin(board);
  
  if (winResult.won) return 100000 + depth; // Order wins
  if (isBoardFull(board)) return -50000; // Board is full, Chaos wins
  if (depth === 0) return evaluateBoard(board);
  
  const currentRole = isMaximizing ? 'order' : 'chaos';
  const moves = generateOrderedMoves(board, currentRole);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = placeMove(board, move.row, move.col, move.symbol);
      const eval_ = minimax(newBoard, depth - 1, alpha, beta, false, aiRole);
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break; 
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = placeMove(board, move.row, move.col, move.symbol);
      const eval_ = minimax(newBoard, depth - 1, alpha, beta, true, aiRole);
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break; 
    }
    return minEval;
  }
}

/**
 * Generates and orders all possible moves to improve alpha-beta pruning.
 * @param {Array<Array<string|null>>} board - Current board state
 * @param {string} currentRole - Role of the player making the move
 * @returns {Array<{row: number, col: number, symbol: string}>} Ordered list of moves
 */
function generateOrderedMoves(board, currentRole) {
  const validCells = getValidMoves(board);
  const moves = [];
  
  for (const cell of validCells) {
    moves.push({ ...cell, symbol: 'X' });
    moves.push({ ...cell, symbol: 'O' });
  }
  
  // Order moves: center > edges > corners
  moves.sort((a, b) => {
    const aCenterDist = Math.abs(a.row - 2.5) + Math.abs(a.col - 2.5);
    const bCenterDist = Math.abs(b.row - 2.5) + Math.abs(b.col - 2.5);
    return aCenterDist - bCenterDist;
  });
  
  return moves;
}

/**
 * Heuristic evaluation function for the board from Order's perspective.
 * Positive values favor Order (working towards 5 in a row).
 * Negative values favor Chaos (blocking lines and mixing symbols).
 * @param {Array<Array<string|null>>} board - Current board state
 * @returns {number} Evaluation score
 */
function evaluateBoard(board) {
  let score = 0;
  const windows = getAllWindows(board);
  
  for (const window of windows) {
    const xs = window.filter(c => c === 'X').length;
    const os = window.filter(c => c === 'O').length;
    const empties = window.filter(c => c === null).length;
    
    if (os === 0 && xs > 0) {
      score += scoreWindow(xs, empties);
    }
    if (xs === 0 && os > 0) {
      score += scoreWindow(os, empties);
    }
    // Mixed window - blocked, good for Chaos
    if (xs > 0 && os > 0) {
      score -= 10; 
    }
  }
  
  // Center control bonus
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 4; c++) {
      if (board[r][c] !== null) {
        score += 2;
      }
    }
  }
  
  return score;
}

/**
 * Scores a window of 5 cells based on symbols and empty spaces.
 * @param {number} count - Number of same symbols
 * @param {number} empties - Number of empty spaces
 * @returns {number} The score
 */
function scoreWindow(count, empties) {
  if (count === 5) return 100000;
  if (count === 4 && empties === 1) return 10000;
  if (count === 3 && empties === 2) return 500;
  if (count === 2 && empties === 3) return 50;
  if (count === 1 && empties === 4) return 10;
  return 0;
}

/**
 * Gets all windows of exactly 5 consecutive cells from the board.
 * @param {Array<Array<string|null>>} board - The current board.
 * @returns {Array<Array<string|null>>} Array of windows, each containing 5 cell values.
 */
function getAllWindows(board) {
  const lines = getAllLines(board);
  const windows = [];
  
  for (const line of lines) {
    if (line.length >= 5) {
      for (let i = 0; i <= line.length - 5; i++) {
        windows.push([
          line[i].val,
          line[i+1].val,
          line[i+2].val,
          line[i+3].val,
          line[i+4].val
        ]);
      }
    }
  }
  
  return windows;
}

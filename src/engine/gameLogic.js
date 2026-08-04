// Board is a 6x6 2D array: null = empty, 'X' or 'O' = placed
const BOARD_SIZE = 6;
const WIN_LENGTH = 5;

/**
 * Creates an empty 6x6 game board.
 * @returns {Array<Array<string|null>>} A 6x6 2D array filled with null.
 */
export function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

/**
 * Creates a deep clone of the given board.
 * @param {Array<Array<string|null>>} board - The board to clone.
 * @returns {Array<Array<string|null>>} The cloned board.
 */
export function cloneBoard(board) {
  return board.map(row => [...row]);
}

/**
 * Checks if a move is valid (within bounds and cell is empty).
 * @param {Array<Array<string|null>>} board - The current board.
 * @param {number} row - The row index (0-5).
 * @param {number} col - The column index (0-5).
 * @returns {boolean} True if the move is valid, false otherwise.
 */
export function isValidMove(board, row, col) {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false;
  return board[row][col] === null;
}

/**
 * Returns a new board with the move placed.
 * @param {Array<Array<string|null>>} board - The current board.
 * @param {number} row - The row index.
 * @param {number} col - The column index.
 * @param {string} symbol - 'X' or 'O'.
 * @returns {Array<Array<string|null>>} A new board with the move.
 */
export function placeMove(board, row, col, symbol) {
  const newBoard = cloneBoard(board);
  newBoard[row][col] = symbol;
  return newBoard;
}

/**
 * Returns an array of all empty cells.
 * @param {Array<Array<string|null>>} board - The current board.
 * @returns {Array<{row: number, col: number}>} Array of valid moves.
 */
export function getValidMoves(board) {
  const moves = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) {
        moves.push({ row: r, col: c });
      }
    }
  }
  return moves;
}

/**
 * Checks if the board is completely full.
 * @param {Array<Array<string|null>>} board - The current board.
 * @returns {boolean} True if full, false otherwise.
 */
export function isBoardFull(board) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) return false;
    }
  }
  return true;
}

/**
 * Extracts all rows, columns, and diagonals (forward and backward, length >= 5) from the board.
 * @param {Array<Array<string|null>>} board - The current board.
 * @returns {Array<Array<{row: number, col: number, val: string|null}>>} Array of lines.
 */
export function getAllLines(board) {
  const lines = [];

  // Rows
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row = [];
    for (let c = 0; c < BOARD_SIZE; c++) row.push({ row: r, col: c, val: board[r][c] });
    lines.push(row);
  }

  // Columns
  for (let c = 0; c < BOARD_SIZE; c++) {
    const col = [];
    for (let r = 0; r < BOARD_SIZE; r++) col.push({ row: r, col: c, val: board[r][c] });
    lines.push(col);
  }

  // Diagonals (only length >= 5)
  // Forward diagonals (\)
  // Main diagonal
  let diag1 = [];
  for (let i = 0; i < BOARD_SIZE; i++) diag1.push({ row: i, col: i, val: board[i][i] });
  lines.push(diag1);
  
  // Upper diagonal (start 0,1)
  let diag2 = [];
  for (let i = 0; i < BOARD_SIZE - 1; i++) diag2.push({ row: i, col: i + 1, val: board[i][i + 1] });
  lines.push(diag2);
  
  // Lower diagonal (start 1,0)
  let diag3 = [];
  for (let i = 0; i < BOARD_SIZE - 1; i++) diag3.push({ row: i + 1, col: i, val: board[i + 1][i] });
  lines.push(diag3);

  // Backward diagonals (/)
  // Main backward diagonal
  let diag4 = [];
  for (let i = 0; i < BOARD_SIZE; i++) diag4.push({ row: i, col: BOARD_SIZE - 1 - i, val: board[i][BOARD_SIZE - 1 - i] });
  lines.push(diag4);
  
  // Upper backward diagonal (start 0, 4)
  let diag5 = [];
  for (let i = 0; i < BOARD_SIZE - 1; i++) diag5.push({ row: i, col: BOARD_SIZE - 2 - i, val: board[i][BOARD_SIZE - 2 - i] });
  lines.push(diag5);
  
  // Lower backward diagonal (start 1, 5)
  let diag6 = [];
  for (let i = 0; i < BOARD_SIZE - 1; i++) diag6.push({ row: i + 1, col: BOARD_SIZE - 1 - i, val: board[i + 1][BOARD_SIZE - 1 - i] });
  lines.push(diag6);

  return lines;
}

/**
 * Checks if there is a win (5 in a row of the same symbol).
 * @param {Array<Array<string|null>>} board - The current board.
 * @returns {{won: boolean, cells: Array<{row: number, col: number}>|null}} Win result.
 */
export function checkWin(board) {
  const lines = getAllLines(board);

  for (const line of lines) {
    let currentSymbol = null;
    let count = 0;
    let winningCells = [];

    for (const cell of line) {
      if (cell.val === null) {
        currentSymbol = null;
        count = 0;
        winningCells = [];
      } else if (cell.val === currentSymbol) {
        count++;
        winningCells.push({ row: cell.row, col: cell.col });
        if (count === WIN_LENGTH) {
          return { won: true, cells: winningCells };
        }
      } else {
        currentSymbol = cell.val;
        count = 1;
        winningCells = [{ row: cell.row, col: cell.col }];
      }
    }
  }

  return { won: false, cells: null };
}

/**
 * Counts occurrences of exactly n consecutive identical symbols in any line.
 * @param {Array<Array<string|null>>} board - The current board.
 * @param {number} n - The exact length of the streak to count.
 * @returns {number} The count of such occurrences.
 */
export function countStraightN(board, n) {
  let count = 0;
  const lines = getAllLines(board);

  for (const line of lines) {
    let currentSymbol = null;
    let currentLength = 0;
    const runs = [];

    for (let i = 0; i < line.length; i++) {
      const val = line[i].val;
      if (val !== null) {
        if (val === currentSymbol) {
          currentLength++;
        } else {
          if (currentLength > 0) runs.push(currentLength);
          currentSymbol = val;
          currentLength = 1;
        }
      } else {
        if (currentLength > 0) runs.push(currentLength);
        currentSymbol = null;
        currentLength = 0;
      }
    }
    if (currentLength > 0) runs.push(currentLength);

    count += runs.filter(len => len === n).length;
  }

  return count;
}

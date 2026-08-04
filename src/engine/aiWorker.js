import { getBestMove } from './aiEngine.js';

self.onmessage = function(e) {
  const { board, aiRole, difficulty } = e.data;
  const move = getBestMove(board, aiRole, difficulty);
  self.postMessage({ move });
};

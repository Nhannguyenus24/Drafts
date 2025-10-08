// Game logic utilities for Tic-Tac-Toe

/**
 * Checks if there's a winner on the board
 * @param {Array} board - 3x3 array representing the game board
 * @returns {string|null} - 'X', 'O', or null if no winner
 */
export const checkWinner = (board) => {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

/**
 * Checks if the board is full (draw)
 * @param {Array} board - 3x3 array representing the game board
 * @returns {boolean} - true if board is full
 */
export const isBoardFull = (board) => {
  return board.every(cell => cell !== null);
};

/**
 * Gets available moves on the board
 * @param {Array} board - 3x3 array representing the game board
 * @returns {Array} - array of available move indices
 */
export const getAvailableMoves = (board) => {
  return board.map((cell, index) => cell === null ? index : null)
              .filter(val => val !== null);
};

/**
 * Checks if the game is over
 * @param {Array} board - 3x3 array representing the game board
 * @returns {boolean} - true if game is over
 */
export const isGameOver = (board) => {
  return checkWinner(board) !== null || isBoardFull(board);
};

/**
 * Creates a copy of the board
 * @param {Array} board - 3x3 array representing the game board
 * @returns {Array} - copy of the board
 */
export const copyBoard = (board) => {
  return [...board];
};

/**
 * Makes a move on the board
 * @param {Array} board - 3x3 array representing the game board
 * @param {number} index - position to make the move
 * @param {string} player - 'X' or 'O'
 * @returns {Array} - new board with the move made
 */
export const makeMove = (board, index, player) => {
  if (board[index] !== null) {
    throw new Error('Invalid move: position already occupied');
  }
  const newBoard = copyBoard(board);
  newBoard[index] = player;
  return newBoard;
};

/**
 * Gets the game status
 * @param {Array} board - 3x3 array representing the game board
 * @param {string} currentPlayer - current player ('X' or 'O')
 * @returns {Object} - game status object
 */
export const getGameStatus = (board, currentPlayer) => {
  const winner = checkWinner(board);
  
  if (winner) {
    return {
      isGameOver: true,
      winner,
      status: `${winner} wins!`,
      isDraw: false
    };
  }
  
  if (isBoardFull(board)) {
    return {
      isGameOver: true,
      winner: null,
      status: "It's a draw!",
      isDraw: true
    };
  }
  
  return {
    isGameOver: false,
    winner: null,
    status: `Next player: ${currentPlayer}`,
    isDraw: false
  };
};

/**
 * Resets the game board
 * @returns {Array} - empty 3x3 board
 */
export const createEmptyBoard = () => {
  return Array(9).fill(null);
};
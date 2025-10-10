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

export const isBoardFull = (board) => {
  return board.every(cell => cell !== null);
};

export const getAvailableMoves = (board) => {
  return board.map((cell, index) => cell === null ? index : null)
              .filter(val => val !== null);
};

export const isGameOver = (board) => {
  return checkWinner(board) !== null || isBoardFull(board);
};

export const copyBoard = (board) => {
  return [...board];
};

export const makeMove = (board, index, player) => {
  if (board[index] !== null) {
    throw new Error('Invalid move: position already occupied');
  }
  const newBoard = copyBoard(board);
  newBoard[index] = player;
  return newBoard;
};

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

export const createEmptyBoard = () => {
  return Array(9).fill(null);
};
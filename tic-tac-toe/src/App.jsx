import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import Board from './components/Board';
import GameInfo from './components/GameInfo';
import AlphaBetaTree from './components/AlphaBetaTree';
import { 
  createEmptyBoard, 
  makeMove, 
  getGameStatus
} from './utils/gameLogic';
import { getAIMove } from './utils/ai';

// Create a modern theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f44336',
      dark: '#d32f2f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#c8e6c9',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const AppContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const GameContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 500,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
}));

function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameMode, setGameMode] = useState('hard');
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [gameStatus, setGameStatus] = useState({ isGameOver: false, winner: null, status: 'Next player: X', isDraw: false });
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlphaBetaTree, setShowAlphaBetaTree] = useState(false);
  const [alphaBetaTreeData, setAlphaBetaTreeData] = useState(null);
  const [lastBoardState, setLastBoardState] = useState(null);

  // Get winning line for highlighting
  const getWinningLine = useCallback(() => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return [];
  }, [board]);

  // Update game status when board changes
  useEffect(() => {
    const status = getGameStatus(board, currentPlayer);
    setGameStatus(status);

    if (status.isGameOver) {
      // Update score
      if (status.winner) {
        setScore(prev => ({
          ...prev,
          [status.winner]: prev[status.winner] + 1
        }));
      } else if (status.isDraw) {
        setScore(prev => ({
          ...prev,
          draws: prev.draws + 1
        }));
      }
      
      // Show alpha-beta tree if we have tree data and it's human vs hard bot
      if (alphaBetaTreeData && gameMode === 'hard' && !isAutoPlaying) {
        setShowAlphaBetaTree(true);
      }
    }
  }, [board, currentPlayer, alphaBetaTreeData, gameMode, isAutoPlaying]);

  // AI move handler
  const makeAIMove = useCallback(() => {
    if (gameStatus.isGameOver) return;

    const difficulty = gameMode === 'easy' ? 'easy' : 'hard';
    const shouldSaveTree = gameMode === 'hard' && currentPlayer === 'O'; // Only for hard bot vs human
    
    const result = getAIMove(board, currentPlayer, difficulty, shouldSaveTree);
    
    let aiMove, treeData = null;
    if (typeof result === 'object') {
      aiMove = result.move;
      treeData = result.treeData;
    } else {
      aiMove = result;
    }
    
    if (aiMove !== -1) {
      try {
        const newBoard = makeMove(board, aiMove, currentPlayer);
        setBoard(newBoard);
        setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
        
        // Save tree data and board state for visualization
        if (treeData && shouldSaveTree) {
          setAlphaBetaTreeData(treeData);
          setLastBoardState([...board]); // Board state before AI move
        }
      } catch (error) {
        console.error('AI move error:', error);
      }
    }
  }, [board, currentPlayer, gameMode, gameStatus.isGameOver]);

  // Handle player moves
  const handleSquareClick = (index) => {
    if (gameStatus.isGameOver || board[index] !== null) {
      return;
    }

    // Prevent human moves in bot vs bot mode
    if (gameMode === 'bot-vs-bot') {
      setAlertMessage('This is Bot vs Bot mode - watch the AIs play!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    // Prevent human moves when it's AI's turn
    if ((gameMode === 'easy' || gameMode === 'hard') && currentPlayer === 'O') {
      setAlertMessage('Wait for the bot to make its move!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    try {
      const newBoard = makeMove(board, index, currentPlayer);
      setBoard(newBoard);
      setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
    } catch (error) {
      console.error('Move error:', error);
    }
  };

  // AI move effect for bot modes
  useEffect(() => {
    if (gameStatus.isGameOver) return;

    const shouldMakeAIMove = () => {
      if (gameMode === 'bot-vs-bot') return true;
      if ((gameMode === 'easy' || gameMode === 'hard') && currentPlayer === 'O') return true;
      return false;
    };

    if (shouldMakeAIMove()) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, gameMode === 'bot-vs-bot' ? 1000 : 500); // Slower for bot vs bot for better viewing

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, makeAIMove, gameStatus.isGameOver]);

  // Auto-play for bot vs bot mode
  useEffect(() => {
    if (gameMode === 'bot-vs-bot' && isAutoPlaying && gameStatus.isGameOver) {
      const timer = setTimeout(() => {
        handleNewGame();
      }, 2000); // Wait 2 seconds before starting new game

      return () => clearTimeout(timer);
    }
  }, [gameMode, isAutoPlaying, gameStatus.isGameOver]);

  // Handle new game
  const handleNewGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setGameStatus({ isGameOver: false, winner: null, status: 'Next player: X', isDraw: false });
    setShowAlphaBetaTree(false);
    setAlphaBetaTreeData(null);
    setLastBoardState(null);
  };

  // Handle game mode change
  const handleGameModeChange = (newMode) => {
    setGameMode(newMode);
    handleNewGame();
    setIsAutoPlaying(false);
    setShowAlphaBetaTree(false);
    setAlphaBetaTreeData(null);
  };

  // Toggle auto-play for bot vs bot
  const handleAutoPlay = () => {
    if (gameMode === 'bot-vs-bot') {
      setIsAutoPlaying(prev => !prev);
      if (!isAutoPlaying && gameStatus.isGameOver) {
        handleNewGame();
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContainer>
        <GameContainer>
          <Title variant="h3">
            Tic-Tac-Toe
          </Title>

          <Fade in={showAlert}>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 2, 
                display: showAlert ? 'flex' : 'none',
                width: '100%',
                maxWidth: 400
              }}
            >
              {alertMessage}
            </Alert>
          </Fade>

          <GameInfo
            status={gameStatus.status}
            gameMode={gameMode}
            onGameModeChange={handleGameModeChange}
            onNewGame={handleNewGame}
            score={score}
            currentPlayer={currentPlayer}
            isGameActive={!gameStatus.isGameOver}
            onAutoPlay={handleAutoPlay}
            isAutoPlaying={isAutoPlaying}
            winner={gameStatus.winner || (gameStatus.isDraw ? 'draw' : null)}
          />

          <Board
            squares={board}
            onClick={handleSquareClick}
            winningLine={getWinningLine()}
            disabled={gameStatus.isGameOver}
          />

          {gameMode === 'bot-vs-bot' && (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Watch as two AI opponents battle it out! The hard bot uses advanced minimax algorithm
              with alpha-beta pruning and should never lose - only win or draw.
            </Typography>
          )}

          {score.X + score.O + score.draws > 0 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Games played: {score.X + score.O + score.draws} | Draws: {score.draws}
              </Typography>
            </Box>
          )}
        </GameContainer>
        
        {/* Alpha-Beta Tree Visualization */}
        {showAlphaBetaTree && alphaBetaTreeData && (
          <AlphaBetaTree
            treeData={alphaBetaTreeData}
            gameBoard={lastBoardState}
            onClose={() => setShowAlphaBetaTree(false)}
          />
        )}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App

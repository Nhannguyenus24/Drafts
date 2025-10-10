import {
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const InfoContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
}));

const StatusText = styled(Typography)(({ theme, winner }) => ({
  fontWeight: 'bold',
  color: winner === 'draw' 
    ? theme.palette.warning.main 
    : winner 
    ? theme.palette.success.main 
    : theme.palette.text.primary,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const ScoreBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  marginBottom: theme.spacing(2),
}));

const ScoreChip = styled(Chip)(({ theme, player }) => ({
  backgroundColor: player === 'X' 
    ? theme.palette.primary.main 
    : theme.palette.secondary.main,
  color: theme.palette.getContrastText(
    player === 'X' 
      ? theme.palette.primary.main 
      : theme.palette.secondary.main
  ),
  fontWeight: 'bold',
  minWidth: 80,
}));

const GameInfo = ({
  status,
  gameMode,
  onGameModeChange,
  onNewGame,
  score,
  currentPlayer,
  isGameActive,
  onAutoPlay,
  isAutoPlaying,
  winner,
}) => {
  const getStatusDisplay = () => {
    if (winner === 'draw') return 'draw';
    return winner;
  };

  return (
    <InfoContainer>
      <StatusText variant="h5" winner={getStatusDisplay()}>
        {status}
      </StatusText>

      <ScoreBox>
        <ScoreChip 
          label={`X: ${score.X}`} 
          player="X"
        />
        <ScoreChip 
          label={`O: ${score.O}`} 
          player="O"
        />
      </ScoreBox>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Game Mode</InputLabel>
          <Select
            value={gameMode}
            label="Game Mode"
            onChange={(e) => onGameModeChange(e.target.value)}
            disabled={isGameActive}
          >
            <MenuItem value="easy">
              Player vs Easy Bot
            </MenuItem>
            <MenuItem value="hard">
              Player vs Hard Bot
            </MenuItem>
            <MenuItem value="bot-vs-bot">
              Bot vs Bot
            </MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onNewGame}
            fullWidth
          >
            New Game
          </Button>
          
          {gameMode === 'bot-vs-bot' && (
            <Button
              variant={isAutoPlaying ? "outlined" : "contained"}
              color="secondary"
              onClick={onAutoPlay}
              sx={{ minWidth: 120 }}
            >
              {isAutoPlaying ? 'Pause' : 'Auto Play'}
            </Button>
          )}
        </Box>

        {currentPlayer && !winner && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Current Turn: {currentPlayer}
            {gameMode !== 'pvp' && gameMode !== 'bot-vs-bot' && currentPlayer === 'O' && ' (Bot)'}
            {gameMode === 'bot-vs-bot' && ' (Bot)'}
          </Typography>
        )}
        
        {gameMode === 'hard' && !winner && (
          <Typography variant="caption" color="primary" textAlign="center" sx={{ mt: 1 }}>
            Cây quyết định Alpha-Beta sẽ hiển thị sau khi game kết thúc!
          </Typography>
        )}
      </Stack>
    </InfoContainer>
  );
};

export default GameInfo;
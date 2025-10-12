import React, { useState } from 'react';
import { Paper, Typography, Box, Button, Divider, Grid, ButtonGroup, Chip, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExplanationContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: 20,
  right: 20,
  width: 500,
  maxHeight: 'calc(100vh - 40px)',
  overflow: 'auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[8],
  zIndex: 1000,

  /* 🎨 Custom scrollbar */
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
    borderRadius: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'dark'
      ? '#555'
      : '#ccc',
    borderRadius: '8px',
    border: `2px solid ${theme.palette.background.paper}`,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? '#777'
      : '#999',
  },
}));


const glowPulse = keyframes`
  0% {
    text-shadow: 0 0 10px rgba(255, 152, 0, 0.7),
                 0 0 20px rgba(255, 152, 0, 0.6),
                 0 0 30px rgba(255, 152, 0, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 152, 0, 1),
                 0 0 40px rgba(255, 152, 0, 0.9),
                 0 0 60px rgba(255, 152, 0, 0.8);
  }
  100% {
    text-shadow: 0 0 10px rgba(255, 152, 0, 0.7),
                 0 0 20px rgba(255, 152, 0, 0.6),
                 0 0 30px rgba(255, 152, 0, 0.5);
  }
`;

const BoardSquare = styled(Box)(({ theme, value, isHighlighted }) => ({
  width: 80,
  height: 80,
  border: `2px solid ${theme.palette.grey[400]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  fontWeight: 'bold',
  backgroundColor: theme.palette.background.paper,
  color:
    value === 'X'
      ? theme.palette.primary.main
      : value === 'O'
      ? theme.palette.secondary.main
      : 'transparent',

  // Khi ô được highlight, O phát sáng và nhấp nháy
  ...(isHighlighted && value === 'O'
    ? {
        animation: `${glowPulse} 1.2s ease-in-out infinite`,
      }
    : {
        textShadow: 'none',
      }),
}));

const AlphaBetaTree = ({ traceData, onClose }) => {
  const [selectedTurnIndex, setSelectedTurnIndex] = useState(0);

  // Lọc chỉ các lượt AI từ trace
  const aiTurns = traceData?.turns?.filter(t => t.phase === 'ai') || [];

  if (aiTurns.length === 0) {
    return (
      <ExplanationContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            Alpha-Beta Pruning Explanation
          </Typography>
          <Button onClick={onClose} size="small" color="primary">
            Close
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          No AI turn data available to display
        </Typography>
      </ExplanationContainer>
    );
  }

  const currentTurn = aiTurns[selectedTurnIndex];
  const board = currentTurn?.board || [];
  const aiMove = currentTurn?.move;
  const treeStats = currentTurn?.treeStats;

  const renderBoard = () => {
    return (
      <Grid container spacing={0} sx={{ width: 246, height: 246, border: '3px solid #333', borderRadius: 1 }}>
        {board.map((cell, index) => (
          <Grid item xs={4} key={index} sx={{ display: 'flex' }}>
            <BoardSquare value={cell} isHighlighted={index === aiMove}>
              {cell || ''}
            </BoardSquare>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <ExplanationContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">
          Alpha-Beta Pruning Explanation
        </Typography>
        <Button onClick={onClose} size="small" color="primary">
          Close
        </Button>
      </Box>
      
      <Divider sx={{ mb: 3 }} />

      {/* AI Turn Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Select AI Turn:</strong>
        </Typography>
        <ButtonGroup size="small" variant="outlined" sx={{ flexWrap: 'wrap' }}>
          {aiTurns.map((turn, index) => (
            <Button
              key={index}
              variant={selectedTurnIndex === index ? 'contained' : 'outlined'}
              onClick={() => setSelectedTurnIndex(index)}
              sx={{ minWidth: 60 }}
            >
              Turn {turn.turn}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Board with highlighted square */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Board state after AI turn {currentTurn.turn}:</strong>
        </Typography>
        {renderBoard()}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Chip
            label={`AI played square ${aiMove} (${currentTurn.player})`}
            color="warning"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Decision Reasoning */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          📊 Decision Reasoning:
        </Typography>
        <Typography variant="body2">
          The AI uses the <strong>Minimax algorithm with Alpha-Beta Pruning</strong> to find the optimal move. 
          The algorithm evaluates all possibilities and chooses the move that provides the highest advantage.
        </Typography>
      </Box>

      {/* Thống kê Alpha-Beta - Phân tích chi tiết */}
      {treeStats && (
        <>
          {/* Performance Overview */}
          <Box sx={{ p: 2, backgroundColor: 'grey.100', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              📈 Performance Overview:
            </Typography>
            <Typography variant="body2" component="div">
              • <strong>Total nodes explored:</strong> {treeStats.totalNodes?.toLocaleString() || 0}<br/>
              • <strong>Leaf nodes (terminal):</strong> {treeStats.leafNodes?.toLocaleString() || 0}<br/>
              • <strong>Pruned branches:</strong> {treeStats.prunedNodes?.toLocaleString() || 0} 
              ({treeStats.totalNodes > 0 ? ((treeStats.prunedNodes / treeStats.totalNodes) * 100).toFixed(1) : 0}%)<br/>
              • <strong>Maximum depth:</strong> {treeStats.maxDepth || 0}<br/>
              {treeStats.durationMs && (
                <>
                  • <strong>Execution time:</strong> {treeStats.durationMs}ms<br/>
                  • <strong>Speed:</strong> ~{treeStats.totalNodes && treeStats.durationMs ? Math.round(treeStats.totalNodes / treeStats.durationMs) : 0} nodes/ms
                </>
              )}
            </Typography>
            
            {/* Pruning efficiency progress bar */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Pruning efficiency:
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={treeStats.totalNodes > 0 ? (treeStats.prunedNodes / treeStats.totalNodes) * 100 : 0}
                sx={{ height: 10, borderRadius: 5, mt: 0.5 }}
                color="success"
              />
            </Box>
          </Box>

          {/* Cutoff Distribution */}
          {treeStats.cutoffs && (
            <Box sx={{ p: 2, backgroundColor: 'warning.light', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                ✂️ Cutoff Distribution:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1, backgroundColor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {treeStats.cutoffs.alphaCut || 0}
                    </Typography>
                    <Typography variant="caption">Alpha Cutoff</Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      (at MAX node)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1, backgroundColor: 'secondary.light', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {treeStats.cutoffs.betaCut || 0}
                    </Typography>
                    <Typography variant="caption">Beta Cutoff</Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      (at MIN node)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Branching Factor */}
          {treeStats.branchingAtDepth && Object.keys(treeStats.branchingAtDepth).length > 0 && (
            <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  🌳 Branching Factor by Depth
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Depth</strong></TableCell>
                        <TableCell><strong>Branching</strong></TableCell>
                        <TableCell><strong>Evals</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(treeStats.branchingAtDepth).map(([depth, branching]) => (
                        <TableRow key={depth}>
                          <TableCell>{depth}</TableCell>
                          <TableCell>{branching}</TableCell>
                          <TableCell>{treeStats.evalsByDepth?.[depth] || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  💡 Branching decreases due to effective pruning
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Benefits */}
          <Box sx={{ p: 1.5, backgroundColor: 'success.light', borderRadius: 1 }}>
            <Typography variant="caption">
              💡 <strong>Benefits:</strong> Alpha-Beta pruning helps reduce {treeStats.prunedNodes?.toLocaleString() || 0} unnecessary 
              branches, significantly speeding up computation compared to pure Minimax!
              {treeStats.cutoffs && (
                <> A total of {(treeStats.cutoffs.alphaCut || 0) + (treeStats.cutoffs.betaCut || 0)} cutoffs occurred.</>
              )}
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Explanation */}
      <Box sx={{ p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>🔍 Algorithm Explanation:</strong><br/>
          • <strong>Alpha (α):</strong> Current best value for MAX (AI)<br/>
          • <strong>Beta (β):</strong> Current best value for MIN (Opponent)<br/>
          • <strong>Pruning:</strong> When β ≤ α, remaining branches are cut off as they cannot improve the result<br/>
          • The highlighted yellow square is the move the AI chose for this turn
        </Typography>
      </Box>
    </ExplanationContainer>
  );
};

export default AlphaBetaTree;
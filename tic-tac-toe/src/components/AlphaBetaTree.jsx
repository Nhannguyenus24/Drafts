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
            Giải thích Alpha-Beta Pruning
          </Typography>
          <Button onClick={onClose} size="small" color="primary">
            Đóng
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Không có dữ liệu lượt AI để hiển thị
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
          Giải thích Alpha-Beta Pruning
        </Typography>
        <Button onClick={onClose} size="small" color="primary">
          Đóng
        </Button>
      </Box>
      
      <Divider sx={{ mb: 3 }} />

      {/* Chọn lượt AI */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Chọn lượt AI:</strong>
        </Typography>
        <ButtonGroup size="small" variant="outlined" sx={{ flexWrap: 'wrap' }}>
          {aiTurns.map((turn, index) => (
            <Button
              key={index}
              variant={selectedTurnIndex === index ? 'contained' : 'outlined'}
              onClick={() => setSelectedTurnIndex(index)}
              sx={{ minWidth: 60 }}
            >
              Lượt {turn.turn}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Bàn cờ với ô highlight */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Trạng thái bàn cờ sau lượt AI {currentTurn.turn}:</strong>
        </Typography>
        {renderBoard()}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Chip
            label={`AI đánh ô ${aiMove} (${currentTurn.player})`}
            color="warning"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Lý do quyết định */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          📊 Lý do quyết định:
        </Typography>
        <Typography variant="body2">
          AI sử dụng thuật toán <strong>Minimax với Alpha-Beta Pruning</strong> để tìm nước đi tối ưu. 
          Thuật toán đánh giá tất cả các khả năng và chọn nước đi mang lại lợi thế cao nhất.
        </Typography>
      </Box>

      {/* Thống kê Alpha-Beta - Phân tích chi tiết */}
      {treeStats && (
        <>
          {/* Tổng quan hiệu suất */}
          <Box sx={{ p: 2, backgroundColor: 'grey.100', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              📈 Tổng quan hiệu suất:
            </Typography>
            <Typography variant="body2" component="div">
              • <strong>Tổng nút đã duyệt:</strong> {treeStats.totalNodes?.toLocaleString() || 0}<br/>
              • <strong>Nút lá (terminal):</strong> {treeStats.leafNodes?.toLocaleString() || 0}<br/>
              • <strong>Nhánh bị cắt tỉa:</strong> {treeStats.prunedNodes?.toLocaleString() || 0} 
              ({treeStats.totalNodes > 0 ? ((treeStats.prunedNodes / treeStats.totalNodes) * 100).toFixed(1) : 0}%)<br/>
              • <strong>Độ sâu tối đa:</strong> {treeStats.maxDepth || 0}<br/>
              {treeStats.durationMs && (
                <>
                  • <strong>Thời gian thực thi:</strong> {treeStats.durationMs}ms<br/>
                  • <strong>Tốc độ:</strong> ~{treeStats.totalNodes && treeStats.durationMs ? Math.round(treeStats.totalNodes / treeStats.durationMs) : 0} nodes/ms
                </>
              )}
            </Typography>
            
            {/* Progress bar hiệu quả pruning */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Hiệu quả cắt tỉa:
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={treeStats.totalNodes > 0 ? (treeStats.prunedNodes / treeStats.totalNodes) * 100 : 0}
                sx={{ height: 10, borderRadius: 5, mt: 0.5 }}
                color="success"
              />
            </Box>
          </Box>

          {/* Phân bổ Cutoff */}
          {treeStats.cutoffs && (
            <Box sx={{ p: 2, backgroundColor: 'warning.light', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                ✂️ Phân bổ Cutoff:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1, backgroundColor: 'primary.light', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {treeStats.cutoffs.alphaCut || 0}
                    </Typography>
                    <Typography variant="caption">Alpha Cutoff</Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      (tại node MAX)
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
                      (tại node MIN)
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
                  🌳 Branching Factor theo độ sâu
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Độ sâu</strong></TableCell>
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
                  💡 Branching giảm dần do pruning hiệu quả
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Lợi ích */}
          <Box sx={{ p: 1.5, backgroundColor: 'success.light', borderRadius: 1 }}>
            <Typography variant="caption">
              💡 <strong>Lợi ích:</strong> Alpha-Beta pruning giúp giảm {treeStats.prunedNodes?.toLocaleString() || 0} nhánh 
              không cần thiết, tăng tốc độ tính toán đáng kể so với Minimax thuần túy!
              {treeStats.cutoffs && (
                <> Tổng cộng {(treeStats.cutoffs.alphaCut || 0) + (treeStats.cutoffs.betaCut || 0)} lần cutoff xảy ra.</>
              )}
            </Typography>
          </Box>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Chú thích */}
      <Box sx={{ p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>🔍 Giải thích thuật toán:</strong><br/>
          • <strong>Alpha (α):</strong> Giá trị tối ưu hiện tại của MAX (AI)<br/>
          • <strong>Beta (β):</strong> Giá trị tối ưu hiện tại của MIN (Đối thủ)<br/>
          • <strong>Pruning:</strong> Khi β ≤ α, các nhánh còn lại bị cắt bỏ vì không thể cải thiện kết quả<br/>
          • Ô sáng màu vàng là nước đi AI đã chọn ở lượt này
        </Typography>
      </Box>
    </ExplanationContainer>
  );
};

export default AlphaBetaTree;
import React from 'react';
import { Paper, Typography, Box, Button, Divider, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const TreeContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: 20,
  right: 20,
  width: 450,
  maxHeight: 'calc(100vh - 40px)',
  overflow: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[8],
  zIndex: 1000,
}));

const TreeSvg = styled('svg')({
  width: '100%',
  height: 'auto',
  minHeight: 400,
  border: '1px solid #e0e0e0',
  borderRadius: 4,
  backgroundColor: '#fafafa',
});

const NodeCircle = styled('circle')(({ theme, nodeType, isPruned }) => ({
  fill: isPruned ? theme.palette.grey[300] :
        nodeType === 'max' ? theme.palette.primary.main : 
        nodeType === 'min' ? theme.palette.secondary.main : 
        theme.palette.grey[400],
  stroke: isPruned ? theme.palette.error.main : theme.palette.common.white,
  strokeWidth: isPruned ? 2 : 3,
  cursor: 'pointer',
  filter: isPruned ? 'none' : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))',
  opacity: isPruned ? 0.6 : 1,
  '&:hover': {
    strokeWidth: isPruned ? 3 : 4,
    filter: isPruned ? 'none' : 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))',
  },
}));

const NodeText = styled('text')(({ theme, isPruned }) => ({
  fill: isPruned ? theme.palette.error.main : theme.palette.common.white,
  fontSize: '12px',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontWeight: 'bold',
  pointerEvents: 'none',
}));

const EdgeLine = styled('line')(({ theme, isPruned }) => ({
  stroke: isPruned ? theme.palette.error.main : theme.palette.text.secondary,
  strokeWidth: isPruned ? 3 : 2,
  strokeDasharray: isPruned ? '5,5' : 'none',
  markerEnd: 'url(#arrowhead)',
}));

const MiniBoardSquare = styled(Box)(({ theme, value }) => ({
  width: 20,
  height: 20,
  border: `1px solid ${theme.palette.grey[400]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 'bold',
  backgroundColor: theme.palette.background.paper,
  color: value === 'X' ? theme.palette.primary.main : 
         value === 'O' ? theme.palette.secondary.main : 
         'transparent',
}));

const AlphaBetaTree = ({ treeData, onClose, gameBoard }) => {

  const renderTree = () => {
    if (!treeData || !treeData.nodes || treeData.nodes.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Không có dữ liệu cây để hiển thị
          </Typography>
        </Box>
      );
    }

    const nodes = treeData.nodes;
    const edges = treeData.edges || [];
    const width = 400;
    
    // Tính toán layout cây theo cấu trúc hierarchical
    const levels = {};
    nodes.forEach(node => {
      if (!levels[node.depth]) levels[node.depth] = [];
      levels[node.depth].push(node);
    });
    
    const maxDepth = Math.max(...Object.keys(levels).map(Number));
    const height = Math.max(400, (maxDepth + 1) * 80 + 100);
    
    // Tính vị trí cho từng node
    const nodePositions = {};
    Object.keys(levels).forEach(depth => {
      const levelNodes = levels[depth];
      const levelHeight = 80 + parseInt(depth) * 80;
      const spacing = width / (levelNodes.length + 1);
      
      levelNodes.forEach((node, index) => {
        nodePositions[node.id] = {
          x: spacing * (index + 1),
          y: levelHeight
        };
      });
    });

    return (
      <TreeSvg viewBox={`0 0 ${width} ${height}`}>
        {/* Định nghĩa arrowhead cho edges */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7" 
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#666"
            />
          </marker>
        </defs>
        
        {/* Render edges trước */}
        {edges.map((edge, index) => {
          const from = nodePositions[edge.from];
          const to = nodePositions[edge.to];
          if (!from || !to) return null;
          
          return (
            <EdgeLine
              key={`edge-${index}`}
              x1={from.x}
              y1={from.y + 25} // Bắt đầu từ dưới node
              x2={to.x}
              y2={to.y - 25} // Kết thúc ở trên node
              isPruned={edge.pruned}
            />
          );
        })}
        
        {/* Render nodes */}
        {nodes.map(node => {
          const pos = nodePositions[node.id];
          if (!pos) return null;
          
          const isPruned = node.isPruned || false;
          
          return (
            <g key={node.id}>
              <NodeCircle
                cx={pos.x}
                cy={pos.y}
                r={25}
                nodeType={node.type}
                isPruned={isPruned}
              />
              <NodeText x={pos.x} y={pos.y - 8} isPruned={isPruned}>
                {isPruned ? 'X' : (node.value !== undefined ? node.value : '?')}
              </NodeText>
              <NodeText x={pos.x} y={pos.y + 2} fontSize="10" isPruned={isPruned}>
                {node.type === 'max' ? 'MAX' : 'MIN'}
              </NodeText>
              {!isPruned && (
                <NodeText x={pos.x} y={pos.y + 12} fontSize="9" isPruned={isPruned}>
                  α:{node.alpha} β:{node.beta}
                </NodeText>
              )}
              {node.move !== null && node.move !== undefined && (
                <NodeText x={pos.x} y={pos.y - 20} fontSize="8" isPruned={isPruned}>
                  move: {node.move}
                </NodeText>
              )}
            </g>
          );
        })}
      </TreeSvg>
    );
  };

  const renderMiniBoard = (board) => {
    if (!board) return null;
    
    return (
      <Grid container spacing={0} sx={{ width: 66, height: 66, border: '2px solid #333' }}>
        {board.map((cell, index) => (
          <Grid item xs={4} key={index} sx={{ display: 'flex' }}>
            <MiniBoardSquare value={cell}>
              {cell || ''}
            </MiniBoardSquare>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <TreeContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">
          Cây Alpha-Beta Pruning
        </Typography>
        <Button
          onClick={onClose}
          size="small"
          color="primary"
        >
          Đóng
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Trạng thái bàn cờ khi AI tính toán:
          </Typography>
          {renderMiniBoard(gameBoard)}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Chú thích:</strong><br/>
            Nút xanh: MAX (AI)<br/>
            Nút đỏ: MIN (Người chơi)<br/>
            Đường đứt nét: Nhánh bị cắt tỉa<br/>
            α,β: Giá trị alpha-beta
          </Typography>
        </Box>
      </Box>
      
      {renderTree()}
      
      {treeData && treeData.stats && (
        <Box sx={{ mt: 2, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>Thống kê:</strong><br/>
            • Tổng nút được tạo: {treeData.stats.totalNodes}<br/>
            • Nút bị cắt tỉa: {treeData.stats.prunedNodes}<br/>
            • Độ sâu tối đa: {treeData.stats.maxDepth}<br/>
            • Nước đi được chọn: {treeData.bestMove}
          </Typography>
        </Box>
      )}
    </TreeContainer>
  );
};

export default AlphaBetaTree;
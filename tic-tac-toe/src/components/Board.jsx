import React from 'react';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Square from './Square';

const BoardContainer = styled(Box)(({ theme }) => ({
  maxWidth: 300,
  margin: '0 auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
}));

const Board = ({ 
  squares, 
  onClick, 
  winningLine = [], 
  disabled = false 
}) => {
  const renderSquare = (index) => {
    const isWinningSquare = winningLine.includes(index);
    
    return (
      <Grid item xs={4} key={index}>
        <Square
          value={squares[index]}
          onClick={() => onClick(index)}
          isWinningSquare={isWinningSquare}
          disabled={disabled}
        />
      </Grid>
    );
  };

  return (
    <BoardContainer>
      <Grid container spacing={1} justifyContent="center">
        {Array.from({ length: 9 }, (_, index) => renderSquare(index))}
      </Grid>
    </BoardContainer>
  );
};

export default Board;
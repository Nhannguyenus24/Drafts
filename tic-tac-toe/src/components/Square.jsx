import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const SquareButton = styled(Paper)(({ theme, winner }) => ({
  width: 80,
  height: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: winner ? theme.palette.success.light : theme.palette.background.paper,
  '&:hover': {
    backgroundColor: winner ? theme.palette.success.light : theme.palette.action.hover,
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
}));

const SquareText = styled(Typography)(({ theme, player }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: player === 'X' ? theme.palette.primary.main : 
         player === 'O' ? theme.palette.secondary.main : 
         theme.palette.text.primary,
  userSelect: 'none',
}));

const Square = ({ value, onClick, isWinningSquare = false, disabled = false }) => {
  const handleClick = () => {
    if (!disabled && !value && onClick) {
      onClick();
    }
  };

  return (
    <SquareButton
      elevation={isWinningSquare ? 4 : 2}
      winner={isWinningSquare}
      onClick={handleClick}
      sx={{
        cursor: disabled || value ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <SquareText player={value}>
        {value}
      </SquareText>
    </SquareButton>
  );
};

export default Square;
import React from 'react';
import { Box, keyframes } from '@mui/material';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
`;

const TypingIndicator: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        py: 0.5,
        px: 1
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#42a5f5',
            animation: `${bounce} 1.4s infinite ease-in-out`,
            animationDelay: `${index * 0.2}s`,
            '&:hover': {
              animation: `${pulse} 1s infinite ease-in-out`
            }
          }}
        />
      ))}
    </Box>
  );
};

export default TypingIndicator; 
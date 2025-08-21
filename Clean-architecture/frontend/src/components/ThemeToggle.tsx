import React from 'react';
import {
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  sx?: any;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium', 
  color = 'inherit',
  sx = {}
}) => {
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();

  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton
        onClick={toggleTheme}
        color={color}
        size={size}
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          ...sx
        }}
      >
        {mode === 'light' ? (
          <DarkModeIcon sx={{ color: theme.palette.text.secondary }} />
        ) : (
          <LightModeIcon sx={{ color: theme.palette.text.secondary }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 
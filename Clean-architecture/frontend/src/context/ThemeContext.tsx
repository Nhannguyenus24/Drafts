import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage first, then system preference
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode) {
      return savedMode;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#0084ff' : '#1976d2',
      },
      secondary: {
        main: mode === 'light' ? '#42a5f5' : '#90caf9',
      },
      background: {
        default: mode === 'light' ? '#f8f9fa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
      },
      text: {
        primary: mode === 'light' ? '#1c1e21' : '#ffffff',
        secondary: mode === 'light' ? '#8e9297' : '#b3b3b3'
      },
      divider: mode === 'light' ? '#e4e6ea' : '#333333',
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 768,
        lg: 1024,
        xl: 1200,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            backgroundImage: 'none',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            height: '100%',
          },
          body: {
            height: '100%',
            margin: 0,
            padding: 0,
            overflowX: 'hidden',
            backgroundColor: mode === 'light' ? '#f8f9fa' : '#121212',
          },
          '#root': {
            height: '100%',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#202123' : '#1a1a1a',
            borderRight: mode === 'light' ? '1px solid #2d2d30' : '1px solid #333333',
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}; 
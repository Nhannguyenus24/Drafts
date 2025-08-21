import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({ name, email, password });
      if (response.status === 200) {
        login(response.data.token);
        navigate('/chat');
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: isMobile ? 4 : 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: isMobile ? '100vh' : 'auto',
          px: isMobile ? 2 : 0
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            padding: isMobile ? 3 : 5, 
            width: '100%',
            borderRadius: isMobile ? '16px' : '20px',
            border: '1px solid #e4e6ea',
            backgroundColor: '#ffffff',
            mt: isMobile ? 2 : 0
          }}
        >
          <Box sx={{ textAlign: 'center', mb: isMobile ? 3 : 4 }}>
            <Typography variant="h3" sx={{ mb: 1, color: '#0084ff', fontSize: isMobile ? '3rem' : '3rem' }}>
              💬
            </Typography>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 600, color: '#1c1e21', fontSize: isMobile ? '1.8rem' : '2.125rem' }}>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#8e9297', mt: 1, fontSize: isMobile ? '0.95rem' : '0.875rem' }}>
              Join us and start chatting with AI
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                backgroundColor: '#fee',
                border: '1px solid #fdd'
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f8f9fa',
                  fontSize: isMobile ? '16px' : '14px',
                  '&:hover fieldset': {
                    borderColor: '#0084ff'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0084ff'
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: isMobile ? '16px' : '14px'
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f8f9fa',
                  fontSize: isMobile ? '16px' : '14px',
                  '&:hover fieldset': {
                    borderColor: '#0084ff'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0084ff'
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: isMobile ? '16px' : '14px'
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f8f9fa',
                  fontSize: isMobile ? '16px' : '14px',
                  '&:hover fieldset': {
                    borderColor: '#0084ff'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0084ff'
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: isMobile ? '16px' : '14px'
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f8f9fa',
                  fontSize: isMobile ? '16px' : '14px',
                  '&:hover fieldset': {
                    borderColor: '#0084ff'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0084ff'
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: isMobile ? '16px' : '14px'
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 2, 
                mb: 3,
                py: isMobile ? 2 : 1.5,
                borderRadius: '12px',
                backgroundColor: '#0084ff',
                fontSize: isMobile ? '18px' : '16px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#0073e6'
                },
                '&:disabled': {
                  backgroundColor: '#e4e6ea'
                }
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToLogin();
                }}
                sx={{
                  color: '#0084ff',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: isMobile ? '16px' : '14px',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 
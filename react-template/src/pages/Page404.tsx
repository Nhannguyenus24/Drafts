import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// sample 404 page component

const Page404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 3,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '6rem', md: '8rem' },
          fontWeight: 'bold',
          color: '#1976d2',
          marginBottom: 2,
        }}
      >
        404
      </Typography>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 2,
          textAlign: 'center',
          color: '#333',
        }}
      >
        Oops! Page Not Found
      </Typography>
      <Typography
        variant="body1"
        sx={{
          marginBottom: 4,
          textAlign: 'center',
          color: '#666',
          maxWidth: '500px',
        }}
      >
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/')}
        sx={{
          padding: '12px 32px',
          fontSize: '1.1rem',
        }}
      >
        Return to Home
      </Button>
    </Box>
  );
};

export default Page404;


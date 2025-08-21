import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon
} from '@mui/icons-material';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState('');
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.style.height = 'auto';
      textFieldRef.current.style.height = `${Math.min(textFieldRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 3,
        pt: 2,
        borderTop: '1px solid #e4e6ea',
        backgroundColor: '#ffffff',
        // Add safe area for mobile keyboards
        pb: isMobile ? 'max(16px, env(safe-area-inset-bottom))' : 3
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: isMobile ? 1 : 1.5,
          p: isMobile ? 1.5 : 1.5,
          borderRadius: isMobile ? '20px' : '24px',
          border: '1px solid #e4e6ea',
          backgroundColor: '#f8f9fa',
          transition: 'all 0.2s ease',
          '&:focus-within': {
            borderColor: '#0084ff',
            boxShadow: '0 0 0 2px rgba(0, 132, 255, 0.1)',
            backgroundColor: '#ffffff'
          }
        }}
      >
        <TextField
          inputRef={textFieldRef}
          multiline
          maxRows={isMobile ? 4 : 5}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: isMobile ? '16px' : '15px',
              lineHeight: 1.4,
              padding: isMobile ? '12px 16px' : '8px 12px',
              '&.Mui-disabled': {
                color: '#8e9297'
              }
            }
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontSize: isMobile ? '16px' : '15px'
            },
            '& .MuiInputBase-input': {
              resize: 'none',
              scrollbarWidth: 'thin',
              '&::placeholder': {
                color: '#8e9297',
                opacity: 1
              },
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent'
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#d0d7de',
                borderRadius: '3px'
              }
            }
          }}
        />
        
        <IconButton
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          sx={{
            bgcolor: message.trim() && !disabled ? '#0084ff' : '#e4e6ea',
            color: message.trim() && !disabled ? 'white' : '#8e9297',
            width: isMobile ? 44 : 36,
            height: isMobile ? 44 : 36,
            mb: 0.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: message.trim() && !disabled ? '#0073e6' : '#d0d7de',
              transform: message.trim() && !disabled ? 'scale(1.05)' : 'none'
            },
            '&.Mui-disabled': {
              color: '#8e9297',
              bgcolor: '#e4e6ea'
            }
          }}
        >
          <SendIcon sx={{ fontSize: isMobile ? 20 : 18 }} />
        </IconButton>
      </Paper>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 1.5
        }}
      >
        {/* Could add tips or AI info here */}
      </Box>
    </Box>
  );
};

export default MessageInput; 
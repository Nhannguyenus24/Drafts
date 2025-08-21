import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../../types';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: isMobile ? 2 : 3,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 1.5 : 2,
        backgroundColor: '#f8f9fa'
      }}
    >
      {messages.length !== 0 &&  (
        <>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1,
                  maxWidth: isMobile ? '90%' : '75%',
                  flexDirection: message.isUser ? 'row-reverse' : 'row'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.isUser ? '#0084ff' : '#42a5f5',
                    width: isMobile ? 36 : 32,
                    height: isMobile ? 36 : 32,
                    mb: 0.5
                  }}
                >
                  {message.isUser ? <PersonIcon sx={{ fontSize: isMobile ? 20 : 18 }} /> : <BotIcon sx={{ fontSize: isMobile ? 20 : 18 }} />}
                </Avatar>
                
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: isMobile ? 2.5 : 2,
                      backgroundColor: message.isUser ? '#0084ff' : '#ffffff',
                      color: message.isUser ? 'white' : '#1c1e21',
                      borderRadius: message.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      border: message.isUser ? 'none' : '1px solid #e4e6ea',
                      boxShadow: message.isUser ? '0 2px 8px rgba(0, 132, 255, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                      minWidth: '40px',
                      maxWidth: '100%',
                      wordBreak: 'break-word'
                    }}
                  >
                    {message.isUser ? (
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.4,
                          fontSize: isMobile ? '16px' : '15px'
                        }}
                      >
                        {message.content}
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          '& p': {
                            margin: '0 0 8px 0',
                            lineHeight: 1.4,
                            fontSize: isMobile ? '16px' : '15px',
                            '&:last-child': { mb: 0 }
                          },
                          '& code': {
                            backgroundColor: '#f0f2f5',
                            color: '#e91e63',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: isMobile ? '14px' : '13px',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                          },
                          '& pre': {
                            backgroundColor: '#2d3748',
                            color: '#e2e8f0',
                            padding: isMobile ? '16px' : '12px',
                            borderRadius: '8px',
                            fontSize: isMobile ? '14px' : '13px',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            overflow: 'auto',
                            margin: '8px 0'
                          },
                          '& ul, & ol': {
                            paddingLeft: '16px',
                            margin: '8px 0'
                          },
                          '& blockquote': {
                            borderLeft: '4px solid #42a5f5',
                            paddingLeft: '16px',
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            margin: '8px 0',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '0 8px 8px 0'
                          }
                        }}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </Box>
                    )}
                  </Paper>
                  
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#8e9297',
                      mt: 0.5,
                      mx: 1,
                      fontSize: isMobile ? '13px' : '12px'
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
          
          {loading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 1
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1,
                  maxWidth: '75%'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#42a5f5',
                    width: 32,
                    height: 32,
                    mb: 0.5
                  }}
                >
                  <BotIcon sx={{ fontSize: 18 }} />
                </Avatar>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: '#ffffff',
                    borderRadius: '18px 18px 18px 4px',
                    border: '1px solid #e4e6ea',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: '80px'
                  }}
                >
                  <TypingIndicator />
                </Paper>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default MessageList; 
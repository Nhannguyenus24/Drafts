import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ThemeToggle from '../ThemeToggle';
import { Conversation, Message } from '../../types';
import { chatService } from '../../services/api';

const SIDEBAR_WIDTH = 280;

const ChatInterface: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load conversations on component mount
  const loadConversations = useCallback(async () => {
    try {
      const response = await chatService.getHistory();
      if (response.status === 200) {
        setConversations(response.data);
      } else {
        console.error('Failed to load conversations:', response.message);
      }
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadMessages = async (conversationId: number) => {
    try {
      const response = await chatService.getConversation(conversationId);
      if (response.status === 200) {
        setMessages(response.data);
        setError('');
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError('Failed to load messages');
      setMessages([]);
    }
  };

  const handleConversationSelect = async (conversationId: number) => {
    setCurrentConversationId(conversationId);
    setMessages([]);
    setError(''); // Clear any previous errors
    await loadMessages(conversationId);
    
    // Close mobile drawer when conversation is selected
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleNewChat = async () => {
    // Create new conversation
    const conversationName = `Chat ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}`;
    try {
      const response = await chatService.createConversation(conversationName);
      if (response.status === 201) {
        const newConversationId = response.data;
        // Set the new conversation as current immediately
        setCurrentConversationId(newConversationId);
        setMessages([]); // Clear messages for new conversation
        setError('');
        
        // Reload conversations to update the sidebar
        await loadConversations();
        
        // Ensure the new conversation is selected and focused
        // This will show the empty conversation ready for the first message
      }
    } catch (err: any) {
      setError('Failed to create new conversation');
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!currentConversationId) {
      setError('Please select or create a conversation first');
      return;
    }

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now(),
      content: messageContent,
      timestamp: new Date().toISOString(),
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError('');

    try {
      const response = await chatService.sendMessage(currentConversationId, messageContent);
      if (response.status === 200) {
        // Add AI response
        const aiMessage: Message = {
          id: Date.now() + 1,
          content: response.data,
          timestamp: new Date().toISOString(),
          isUser: false
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError('Failed to send message');
      // Remove user message if failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onNewChat={handleNewChat}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: '#ffffff',
          width: isMobile ? '100%' : `calc(100% - ${SIDEBAR_WIDTH}px)`,
        }}
      >
        {/* Mobile Header */}
        {isMobile && (
          <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
              backgroundColor: '#ffffff',
              color: '#1c1e21',
              borderBottom: '1px solid #e4e6ea'
            }}
          >
            <Toolbar sx={{ minHeight: '56px !important', px: 2 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography 
                variant="h6" 
                noWrap
                sx={{ 
                  flexGrow: 1,
                  fontWeight: 600,
                  fontSize: '16px'
                }}
              >
                {currentConversationId 
                  ? conversations.find(c => c.id === currentConversationId)?.name || 'Chat'
                  : 'AI Chat Assistant'
                }
              </Typography>
              <ThemeToggle size="medium" />
            </Toolbar>
          </AppBar>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <Box
            sx={{
              p: 3,
              pb: 2,
              borderBottom: '1px solid #e4e6ea',
              backgroundColor: '#ffffff',
              zIndex: 1,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#1c1e21',
                fontSize: '18px'
              }}
            >
              {currentConversationId 
                ? conversations.find(c => c.id === currentConversationId)?.name || 'Chat'
                : 'AI Chat Assistant'
              }
            </Typography>
            {currentConversationId && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#8e9297',
                  fontSize: '13px',
                  mt: 0.5
                }}
              >
                Online • Ready to help
              </Typography>
            )}
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              m: 3,
              borderRadius: '12px'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Messages Area */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {currentConversationId ? (
            <>
              <MessageList messages={messages} loading={loading} />
              <div ref={messagesEndRef} />
            </>
          ) : (
            // Welcome screen when no conversation is selected
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: '#1c1e21',
                  mb: 2
                }}
              >
                Welcome to AI Chat
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#8e9297',
                  mb: 4,
                  maxWidth: '400px'
                }}
              >
                Start a new conversation or select an existing one from the sidebar to begin chatting with our AI assistant.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  maxWidth: '300px'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#0084ff'
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#65676b' }}>
                    Ask questions and get instant responses
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#0084ff'
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#65676b' }}>
                    Continue previous conversations
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#0084ff'
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#65676b' }}>
                    Context-aware AI responses
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Message Input */}
        {currentConversationId && (
          <MessageInput 
            onSendMessage={handleSendMessage}
            disabled={loading}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChatInterface; 
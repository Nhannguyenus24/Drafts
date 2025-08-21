import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Button,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Conversation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: number | null;
  onConversationSelect: (conversationId: number) => void;
  onNewChat: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

const SIDEBAR_WIDTH = 280;

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onConversationSelect,
  onNewChat,
  mobileOpen = false,
  onMobileClose = () => {},
  isMobile = false
}) => {
  const { logout } = useAuth();

  const handleNewChat = () => {
    onNewChat(); // Just call the parent handler
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US');
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* New Chat Button */}
      <Box sx={{ p: isMobile ? 2 : 3, pb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleNewChat}
          sx={{
            color: 'white',
            borderColor: '#40414f',
            backgroundColor: 'transparent',
            borderRadius: '12px',
            py: 1.5,
            fontSize: isMobile ? '16px' : '14px',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#40414f',
              borderColor: '#565869'
            }
          }}
        >
          New Chat
        </Button>
      </Box>

      {/* Chat History */}
      <Box sx={{ flex: 1, overflow: 'auto', px: isMobile ? 1 : 2 }}>
        <List sx={{ p: 0 }}>
          {conversations.map((conversation) => (
            <ListItem key={conversation.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={currentConversationId === conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                sx={{
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 2.5 : 2,
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: '#343541',
                    '&:hover': {
                      backgroundColor: '#40414f'
                    }
                  },
                  '&:hover': {
                    backgroundColor: '#2a2b32'
                  }
                }}
              >
                <ChatIcon sx={{ mr: 3, fontSize: isMobile ? 20 : 18, color: '#8e9297' }} />
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: currentConversationId === conversation.id ? 600 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: isMobile ? '16px' : '14px',
                        color: currentConversationId === conversation.id ? '#ffffff' : '#d1d5db'
                      }}
                    >
                      {conversation.name}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#8e9297',
                        fontSize: isMobile ? '14px' : '12px'
                      }}
                    >
                      {formatDate(conversation.createdAt)}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
          {conversations.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: '#8e9297', fontSize: isMobile ? '16px' : '14px', mb: 1 }}>
                No conversations yet
              </Typography>
              <Typography sx={{ color: '#6f7177', fontSize: isMobile ? '14px' : '12px' }}>
                Start a new chat to begin
              </Typography>
            </Box>
          )}
        </List>
      </Box>

              <Divider sx={{ borderColor: '#2d2d30', mx: 2 }} />

        {/* Theme Toggle and Logout */}
        <Box sx={{ p: isMobile ? 2 : 3, pt: 2 }}>
          {/* Theme Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ThemeToggle 
              size={isMobile ? 'large' : 'medium'}
              sx={{
                color: '#8e9297',
                '&:hover': {
                  backgroundColor: '#40414f',
                  color: 'white'
                }
              }}
            />
          </Box>
          
          {/* Logout Button */}
          <Button
            fullWidth
            variant="text"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              color: '#8e9297',
              borderRadius: '12px',
              py: 1.5,
              fontSize: isMobile ? '16px' : '14px',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#40414f',
                color: 'white'
              }
            }}
          >
            Logout
          </Button>
        </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: Math.min(SIDEBAR_WIDTH, window.innerWidth * 0.85),
            backgroundColor: '#202123',
            color: 'white',
            borderRight: '1px solid #2d2d30'
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
            backgroundColor: '#202123',
            color: 'white',
            borderRight: '1px solid #2d2d30'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 
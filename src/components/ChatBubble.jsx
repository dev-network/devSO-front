import React from 'react';
import { Fab, Box, Badge } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useChat } from '../contexts/ChatContext';

const ChatBubble = () => {
  const { isChatOpen, toggleChat, totalUnreadCount } = useChat();

  return (
    <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300 }}>
      <Fab color="primary" aria-label="chat" onClick={toggleChat}>
        <Badge badgeContent={totalUnreadCount} color="error">
          {isChatOpen ? <CloseIcon /> : <ChatIcon />}
        </Badge>
      </Fab>
    </Box>
  );
};

export default ChatBubble;

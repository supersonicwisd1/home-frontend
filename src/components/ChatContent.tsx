// src/components/ChatContent.tsx
import { useState } from 'react';
import { Box, Typography, Button, TextField, Avatar, IconButton } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { ChatIcon } from '../components/icons'

const ChatContent = () => {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<any[]>([]); // Replace with proper types

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {chats.length === 0 ? (
        // Empty State
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChatIcon />
          <Typography variant="h6" sx={{ mb: 1 }}>No Chats</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You have not received or send anyone a message.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {/* Handle add person */}}
          >
            Add a person
          </Button>
        </Box>
      ) : (
        // Chat Messages
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* Messages list will go here */}
          
          {/* Message Input */}
          <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Write your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              size="small"
            />
            <IconButton color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatContent;
// src/components/MessageList.tsx
import { Box, Typography, Divider } from '@mui/material';
import { Message } from '../types';
import ChatBubble from './ChatBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  // console.log('Rendering Messages:', messages); // Debug Log
  // console.log('MessageList received:', { 
  //   messages, 
  //   currentUserId,
  //   messageCount: messages.length 
  // });

  if (!Array.isArray(messages)) {
    // console.error('Messages is not an array:', messages);
    return (
      <Box sx={{ flex: 1, p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">Error loading messages</Typography>
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box sx={{ flex: 1, p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">No messages yet</Typography>
      </Box>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <Box key={date}>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
              {date}
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>
          {dateMessages.map((message) => {
            const isOwn = message.senderId.toString() === currentUserId.toString();
            // console.log('Message ownership:', {
            //   messageId: message.id,
            //   senderId: message.senderId,
            //   currentUserId,
            //   isOwn
            // });
            
            return (
              <ChatBubble
                key={message.id}
                message={message.content}
                timestamp={message.timestamp}
                isOwn={isOwn}
                senderName={message.senderName}
                senderAvatar={message.senderAvatar}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default MessageList;
// src/components/ChatBubble.tsx
import { Box, Typography, Avatar } from '@mui/material';

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string;
}

const ChatBubble = ({ message, timestamp, isOwn, senderName, senderAvatar }: ChatBubbleProps) => {
  // Simple time formatting
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1,
        mb: 2,
      }}
    >
      {!isOwn && (
        <Avatar
          src={senderAvatar}
          alt={senderName}
          sx={{ width: 32, height: 32 }}
        />
      )}
      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwn ? 'flex-end' : 'flex-start',
        }}
      >
        {!isOwn && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {senderName}
          </Typography>
        )}
        <Box
          sx={{
            bgcolor: isOwn ? '#e3f2fd' : '#f5f5f5',
            borderRadius: 2,
            p: 1.5,
            position: 'relative',
          }}
        >
          <Typography variant="body1">{message}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 0.5 }}
          >
            {formatTime(timestamp)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatBubble;
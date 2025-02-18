// src/components/SuccessNotification.tsx
import { Box, Typography } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

interface SuccessNotificationProps {
  message: string;
}

const SuccessNotification = ({ message }: SuccessNotificationProps) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: 'white',
        boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderRadius: '8px',
        p: 2,
        zIndex: 2000
      }}
    >
      <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 20 }} />
      <Typography sx={{ color: '#111827', fontSize: '14px', fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default SuccessNotification;
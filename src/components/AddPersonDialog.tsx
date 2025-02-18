// src/components/AddPersonDialog.tsx
import { 
    Dialog, 
    DialogTitle, 
    DialogContent,
    Box,
    TextField,
    Button,
    Typography
  } from '@mui/material';
  import { useState } from 'react';
  
  interface AddPersonDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (email: string, name: string) => void;
  }
  
  const AddPersonDialog = ({ open, onClose, onAdd }: AddPersonDialogProps) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
  
    const handleSubmit = () => {
      onAdd(email, name);
      setEmail('');
      setName('');
      onClose();
    };
  
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            p: 2
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            p: 0,
            mb: 3,
            fontSize: '18px',
            fontWeight: 500
          }}
        >
          Invite a Person
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Typography 
              sx={{ 
                mb: 1,
                fontSize: '14px',
                color: 'text.secondary'
              }}
            >
              Email Address
            </Typography>
            <TextField
              placeholder="E.g john@gmail.com"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f8f9fa',
                  '& input': {
                    fontSize: '14px',
                    py: 1.5,
                  }
                }
              }}
            />
          </Box>
  
          <Box sx={{ mb: 3 }}>
            <Typography 
              sx={{ 
                mb: 1,
                fontSize: '14px',
                color: 'text.secondary'
              }}
            >
              Name <span style={{ color: '#6B7280' }}>(Optional)</span>
            </Typography>
            <TextField
              placeholder="E.g john"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f8f9fa',
                  '& input': {
                    fontSize: '14px',
                    py: 1.5,
                  }
                }
              }}
            />
          </Box>
  
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={onClose}
              sx={{
                flex: 1,
                py: 1.5,
                color: 'text.primary',
                bgcolor: '#f8f9fa',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: '#f3f4f6'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!email}
              sx={{
                flex: 1,
                py: 1.5,
                color: 'white',
                bgcolor: '#1e3a8a',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: '#1e40af'
                },
                '&.Mui-disabled': {
                  bgcolor: '#e2e8f0',
                  color: '#94a3b8'
                }
              }}
            >
              Add person
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default AddPersonDialog;
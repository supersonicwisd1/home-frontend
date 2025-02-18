// src/layouts/MainLayout.tsx
import { 
    Box, 
    Typography, 
    Avatar, 
    IconButton, 
    InputAdornment, 
    TextField,
    Button,
    Divider
  } from '@mui/material';
  import { 
    NotificationsNone as NotificationIcon,
    Search as SearchIcon,
    LocationOn as LocationIcon,
    Send as SendIcon,
    Logout as LogoutIcon,
    Message as MessagesIcon,
    ExpandMore as ExpandMoreIcon
  } from '@mui/icons-material';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  
  interface MainLayoutProps {
    children: React.ReactNode;
  }
  
  const MainLayout = ({ children }: MainLayoutProps) => {
    const [searchHouse, setSearchHouse] = useState('');
    const navigate = useNavigate();
    
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
          {/* Sidebar */}
          <Box
            sx={{
              width: 280,
              bgcolor: '#1e3a8a',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Logo */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src="/house-icon.png" alt="Home" style={{ width: 24, height: 24 }} />
              <Typography 
                sx={{ 
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 500
                }}
              >
                Home
              </Typography>
            </Box>
    
            {/* Messages Navigation */}
            <Box 
              sx={{ 
                mx: 2,
                p: 2, 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer'
              }}
            >
              <MessagesIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontSize: '16px' }}>Messages</Typography>
            </Box>
    
            {/* Logout Button */}
            <Box sx={{ mt: 'auto', p: 3 }}>
              <Button
                fullWidth
                startIcon={<LogoutIcon sx={{ color: '#ef4444' }} />}
                sx={{ 
                  py: 1.5,
                  color: '#ef4444',
                  bgcolor: '#fef2f2',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { 
                    bgcolor: '#fee2e2'
                  }
                }}
              >
                Log out
              </Button>
            </Box>
          </Box>
    
          {/* Main Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {/* Search Field */}
              <TextField
                placeholder="Search for house"
                size="small"
                value={searchHouse}
                onChange={(e) => setSearchHouse(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: 'text.secondary',
                          '& > svg': { fontSize: 18 }
                        }}
                      >
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <LocationIcon />
                        <Typography 
                          sx={{ 
                            ml: 0.5,
                            fontSize: '14px',
                            color: 'text.secondary'
                          }}
                        >
                          location
                        </Typography>
                      </Box>
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-input': {
                      fontSize: '14px',
                      py: 1.5,
                    },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#f8f9fa',
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                    }
                  }
                }}
                sx={{ width: 400 }}
              />
    
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* Notification Bell */}
                <IconButton
                    sx={{ 
                    width: 40,
                    height: 40,
                    bgcolor: '#f8f9fa',
                    '&:hover': { bgcolor: '#f3f4f6' },
                    '& svg': {
                        fontSize: 20,
                        color: '#6B7280'
                    }
                    }}
                >
                    <NotificationIcon />
                </IconButton>

                {/* Profile Section */}
                <Box 
                    sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: '#f8f9fa',
                    p: 1,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f3f4f6' }
                    }}
                >
                    <Avatar 
                    sx={{ 
                        width: 28, 
                        height: 28,
                        bgcolor: '#1e3a8a',
                        fontSize: '14px'
                    }}
                    >
                    JD
                    </Avatar>
                    <Typography 
                    sx={{ 
                        mx: 1.5,
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#111827'
                    }}
                    >
                    John Doe
                    </Typography>
                    <ExpandMoreIcon sx={{ color: '#6B7280', fontSize: 20 }} />
                </Box>
                </Box>
            </Box>
    
            {/* Main Content Area */}
            {children}
          </Box>
        </Box>
      );
    };
  
  export default MainLayout;
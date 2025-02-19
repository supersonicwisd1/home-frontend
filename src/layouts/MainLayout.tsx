// src/layouts/MainLayout.tsx
import { 
  Box, 
  Typography, 
  Avatar, 
  IconButton, 
  InputAdornment, 
  TextField,
  Button,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  NotificationsNone as NotificationIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  Logout as LogoutIcon,
  Message as MessagesIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  PhotoCamera as CameraIcon
} from '@mui/icons-material';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [searchHouse, setSearchHouse] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleEditProfile = () => {
    handleMenuClose();
    setIsEditProfileOpen(true);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await updateProfile({ avatar: file });
      } catch (error) {
        console.error('Failed to update avatar:', error);
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
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
          <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>
            Home
          </Typography>
        </Box>

        {/* Messages Navigation */}
        <Box 
          onClick={() => navigate('/chat')}
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
          <a href='/chat'><Typography sx={{ fontSize: '16px' }}>Messages</Typography></a>
        </Box>

        {/* Logout Button */}
        <Box sx={{ mt: 'auto', p: 3 }}>
          <Button
            fullWidth
            onClick={handleLogout}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <LocationIcon />
                    <Typography sx={{ ml: 0.5, fontSize: '14px' }}>
                      location
                    </Typography>
                  </Box>
                </InputAdornment>
              ),
              sx: { bgcolor: '#f8f9fa' }
            }}
            sx={{ width: 400 }}
          />

          {/* Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton>
              <NotificationIcon />
            </IconButton>

            <Box 
              onClick={handleMenuClick}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: '#f3f4f6' }
              }}
            >
              <Avatar 
                src={user?.avatar}
                sx={{ width: 32, height: 32 }}
              >
                {user?.username?.[0].toUpperCase()}
              </Avatar>
              <Typography sx={{ ml: 1 }}>{user?.username}</Typography>
              <ExpandMoreIcon />
            </Box>
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditProfile}>
            <EditIcon sx={{ mr: 1 }} /> Edit Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              {/* Avatar Upload */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={user?.avatar}
                  sx={{ width: 64, height: 64, cursor: 'pointer' }}
                  onClick={handleAvatarClick}
                >
                  {user?.username?.[0].toUpperCase()}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outlined"
                  startIcon={<CameraIcon />}
                  onClick={handleAvatarClick}
                >
                  Change Avatar
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditProfileOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Main Content Area */}
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
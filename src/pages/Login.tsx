// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Typography, 
  Paper,
  Link,
  Alert
} from '@mui/material';
import { Google as GoogleIcon, Home as HomeIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, googleLogin } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Implement Google OAuth login
    // This depends on your Google OAuth setup
  };

  // const handleGoogleLogin = async (credentialResponse: any) => {
  //   try {
  //     const decoded = jwtDecode(credentialResponse.credential);
  //     console.log("Google decoded data:", decoded);

  //     if (!decoded || !decoded.email) {
  //       console.error("Invalid Google login response");
  //       return;
  //     }

  //     await googleLogin(credentialResponse.credential);
  //   } catch (error) {
  //     console.error("Google login failed:", error);
  //   }
  // };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        {/* Home Logo Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4
          }}
        >
          <HomeIcon sx={{ color: '#1976d2', mr: 1 }} />
          <Typography 
            component="h1" 
            variant="h6" 
            sx={{ color: '#1976d2' }}
          >
            Home
          </Typography>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            bgcolor: 'white'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              👋 Welcome back
            </Typography>
            <Typography color="text.secondary">
              Login to your account
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Google Login Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ 
              mb: 3,
              py: 1.5,
              color: 'text.primary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'transparent'
              }
            }}
          >
            Continue with Google
          </Button>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3 
            }}
          >
            <Box sx={{ flex: 1, borderBottom: 1, borderColor: 'divider' }} />
            <Typography sx={{ px: 2, color: 'text.secondary' }}>or</Typography>
            <Box sx={{ flex: 1, borderBottom: 1, borderColor: 'divider' }} />
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Typography 
              variant="body2" 
              sx={{ mb: 1, color: 'text.secondary' }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              id="email"
              name="email"
              placeholder="assessment@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: '#f8f9fa'
                }
              }}
            />

            <Typography 
              variant="body2" 
              sx={{ mb: 1, color: 'text.secondary' }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type="password"
              id="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: '#f8f9fa'
                }
              }}
            />

            <Link
              href="#"
              underline="hover"
              sx={{
                display: 'block',
                textAlign: 'left',
                mb: 3,
                color: '#FF9800'
              }}
            >
              Forgot Password?
            </Link>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0'
                }
              }}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>

            {/* Signup link */}
            <Box 
              sx={{ 
                mt: 2,
                textAlign: 'center',
                color: 'text.secondary'
              }}
            >
              <Typography variant="body2" display="inline" sx={{ mr: 1 }}>
                Don't have an account?
              </Typography>
              <Link
                href="/signup"
                sx={{ 
                  color: '#1976d2',
                  textDecoration: 'none',
                  '&:hover': { 
                    textDecoration: 'underline' 
                  }
                }}
              >
                Sign up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
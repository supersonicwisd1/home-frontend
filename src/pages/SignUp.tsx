// src/pages/SignUp.tsx
import { useState } from 'react';
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
import { Home as HomeIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (password !== password2) {
        throw new Error("Passwords don't match");
      }
      await register(email, password, password2);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
              Sign Up
            </Typography>
            <Typography color="text.secondary">
              Create an account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

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
              Confirm Password
            </Typography>
            <TextField
              fullWidth
              name="password2"
              type="password"
              id="password2"
              placeholder="******"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
              InputProps={{
                sx: {
                  bgcolor: '#f8f9fa'
                }
              }}
            />

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
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            {/* Login link */}
            <Box 
              sx={{ 
                mt: 2,
                textAlign: 'center',
                color: 'text.secondary'
              }}
            >
              <Typography variant="body2" display="inline" sx={{ mr: 1 }}>
                Already have an account?
              </Typography>
              <Link
                href="/"
                sx={{ 
                  color: '#1976d2',
                  textDecoration: 'none',
                  '&:hover': { 
                    textDecoration: 'underline' 
                  }
                }}
              >
                Log in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;
// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, password2: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  updateProfile: (data: { email?: string; username?: string; avatar?: File }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setIsLoading(false);
  }, []);

  // Add token expiration check
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            logout();
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking token expiration:', error);
          logout();
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access, refresh, ...userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      navigate('/chat');
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const register = async (email: string, password: string, password2: string) => {
    try {
      const response = await authAPI.register({ email, password, password2 });
      navigate('/', { 
        state: { 
          message: response.data.message,
          registeredEmail: email 
        } 
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  const updateProfile = async (data: { email?: string; username?: string; avatar?: File }) => {
    try {
      const formData = new FormData();
      if (data.email) formData.append('email', data.email);
      if (data.username) formData.append('username', data.username);
      if (data.avatar) formData.append('avatar', data.avatar);

      const response = await authAPI.updateProfile(formData);
      const { access, refresh, user: updatedUser} = response.data;

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  const googleLogin = async (token: string) => {
    try {
      const response = await authAPI.googleLogin(token);
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      navigate('/chat');
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Google login failed');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
      isLoading, 
      login, 
      register, 
      logout, 
      googleLogin,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
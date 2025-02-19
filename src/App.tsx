// src/App.tsx
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './routes';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
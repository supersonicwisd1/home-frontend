// src/App.tsx
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { HashRouter } from 'react-router-dom';
import { Routes } from './routes';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme();

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes />
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
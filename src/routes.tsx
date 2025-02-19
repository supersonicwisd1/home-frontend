// src/routes.tsx
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import { ProtectedRoute } from './components/ProtectedRoute';

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      {/* Add a catch-all route */}
      <Route path="*" element={<Login />} />
    </RouterRoutes>
  );
};
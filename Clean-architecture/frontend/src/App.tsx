import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomThemeProvider } from './context/ThemeContext';
import AuthPage from './components/Auth/AuthPage';
import ChatInterface from './components/Chat/ChatInterface';
import ProtectedRoute from './components/ProtectedRoute';



const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={
          isAuthenticated ? <Navigate to="/chat" replace /> : <AuthPage />
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <ChatInterface />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated ? "/chat" : "/auth"} replace />
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;

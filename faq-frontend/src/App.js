import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatPage from './pages/chatpage';
import AdminPage from './pages/adminpage';
import LoginPage from './pages/loginpage';
import { authApi } from './api/authApi';
import { getEnvironmentInfo } from './config';
import './style.css';

// Lab 2 - Main Application Component
// main entry point for React SPA using React Router
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        setError(null);
        console.log('🔍 Checking user authentication status...');
        const userData = await authApi.getCurrentUser();
        console.log('✅ User authenticated:', userData);
        setUser(userData);
      } catch (error) {
        // User not authenticated or network error
        const errorMessage = error.message || error.response?.data?.error || 'Authentication failed';
        const errorStatus = error.response?.status;
        
        console.log('❌ Authentication check failed:', errorMessage);
        console.log('Error status:', errorStatus);
        console.log('Error details:', error);
        
        setUser(null);
        
        // Handle different types of errors
        if (errorStatus === 401) {
          // 401 is expected for unauthenticated users, don't show error
          console.log('ℹ️ User not authenticated (401) - this is normal for new visitors');
        } else if (errorStatus >= 500 || error.code === 'NETWORK_ERROR') {
          setError('Network connection error, please check your connection');
        } else if (errorStatus >= 400) {
          setError(`Authentication error: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setError(null);
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local user state
      setUser(null);
      setError('Logout error occurred, but local login state has been cleared');
    }
  };

  // Show environment info (only in development environment)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Environment Info:', getEnvironmentInfo());
    }
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {error && (
        <div className="error-banner" onClick={() => setError(null)}>
          <span>{error}</span>
          <button className="error-close">×</button>
        </div>
      )}
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} 
        />
        <Route 
          path="/" 
          element={user ? <ChatPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={
            user ? (
              user.role === 'admin' ? 
                <AdminPage user={user} onLogout={handleLogout} /> : 
                <Navigate to="/" />
            ) : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

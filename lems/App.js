import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app" data-theme={theme}>
        <Routes>
          <Route 
            path="/" 
            element={<StudentPortal theme={theme} onThemeChange={handleThemeChange} />} 
          />
          <Route 
            path="/admin/login" 
            element={
              isAuthenticated ? (
                <AdminDashboard 
                  theme={theme} 
                  onThemeChange={handleThemeChange}
                  onLogout={handleLogout}
                />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <AdminDashboard 
                  theme={theme} 
                  onThemeChange={handleThemeChange}
                  onLogout={handleLogout}
                />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


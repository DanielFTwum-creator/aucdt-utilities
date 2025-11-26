import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DocumentUpload from './pages/DocumentUpload';
import AnalysisView from './pages/AnalysisView';
import Login from './pages/Login';
import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
}

function App() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ isAuthenticated: true, user: { email: 'demo@aucdt.edu.gh' } });
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route 
            path="/" 
            element={auth.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/upload" 
            element={auth.isAuthenticated ? <DocumentUpload /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/analysis/:id" 
            element={auth.isAuthenticated ? <AnalysisView /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

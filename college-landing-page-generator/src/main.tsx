import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { AdminGuard } from './components/AdminGuard';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminTesting } from './pages/AdminTesting';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminGuard />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="logs" element={<div className="p-4 text-white">Logs coming soon</div>} />
            <Route path="testing" element={<AdminTesting />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);

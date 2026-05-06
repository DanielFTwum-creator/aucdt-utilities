import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Diagnostics from './pages/admin/Diagnostics';
import Logs from './pages/admin/Logs';
import Testing from './pages/admin/Testing';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="diagnostics" element={<Diagnostics />} />
            <Route path="testing" element={<Testing />} />
            <Route path="logs" element={<Logs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

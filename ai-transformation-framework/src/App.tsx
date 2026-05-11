import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Diagnostics from "./pages/admin/Diagnostics";
import DBMonitor from "./pages/admin/DBMonitor";
import Testing from "./pages/admin/Testing";
import Logs from "./pages/admin/Logs";
import Performance from "./pages/admin/Performance";
import Login from "./pages/admin/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter basename="/transform">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/diagnostics" element={
          <ProtectedRoute><Diagnostics /></ProtectedRoute>
        } />
        <Route path="/admin/db-monitor" element={
          <ProtectedRoute><DBMonitor /></ProtectedRoute>
        } />
        <Route path="/admin/testing" element={
          <ProtectedRoute><Testing /></ProtectedRoute>
        } />
        <Route path="/admin/logs" element={
          <ProtectedRoute><Logs /></ProtectedRoute>
        } />
        <Route path="/admin/performance" element={
          <ProtectedRoute><Performance /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

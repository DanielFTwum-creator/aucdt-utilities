import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Courses from './pages/Courses'
import EnterScores from './pages/EnterScores'
import Transcripts from './pages/Transcripts'
import Reports from './pages/Reports'
import Users from './pages/Users'
import AuditLog from './pages/AuditLog'
import ChangePassword from './pages/ChangePassword'
import ApproveResults from './pages/ApproveResults'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: string[]
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#6B0020'}}><div style={{width:50,height:50,border:'5px solid #F5A800',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 1s linear infinite'}}></div></div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<ProtectedRoute roles={['registrar','qa_officer']}><Students /></ProtectedRoute>} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId/enter-scores" element={<EnterScores />} />
        <Route path="approve-results" element={<ProtectedRoute roles={['registrar','qa_officer']}><ApproveResults /></ProtectedRoute>} />
        <Route path="transcripts" element={<ProtectedRoute roles={['registrar','qa_officer']}><Transcripts /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute roles={['registrar','qa_officer']}><Reports /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute roles={['registrar']}><Users /></ProtectedRoute>} />
        <Route path="audit-log" element={<ProtectedRoute roles={['registrar']}><AuditLog /></ProtectedRoute>} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

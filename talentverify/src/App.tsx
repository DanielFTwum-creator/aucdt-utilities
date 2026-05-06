import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/layout/AdminLayout';
import CandidateLayout from '@/components/layout/CandidateLayout';
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/recruiter/Dashboard';
import AdminDiagnostics from '@/pages/admin/Diagnostics';
import AuditLogs from '@/pages/admin/AuditLogs';
import TestingSuite from '@/pages/admin/Testing';
import QuestionnaireBuilder from '@/pages/admin/QuestionnaireBuilder';
import AssessmentsList from '@/pages/admin/AssessmentsList';
import ApplicationForm from '@/pages/candidate/ApplicationForm';
import ApplicationsList from '@/pages/recruiter/ApplicationsList';
import ApplicationDetail from '@/pages/recruiter/ApplicationDetail';
import PipelineBoard from '@/pages/recruiter/PipelineBoard';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Recruiter Routes */}
            <Route element={<ProtectedRoute allowedRoles={['recruiter', 'admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pipeline" element={<PipelineBoard />} />
                <Route path="/candidates" element={<ApplicationsList />} />
                <Route path="/applications/:id" element={<ApplicationDetail />} />
                <Route path="/assessments" element={<AssessmentsList />} />
                <Route path="/assessments/new" element={<QuestionnaireBuilder />} />
              </Route>
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/diagnostics" element={<AdminDiagnostics />} />
                <Route path="/admin/logs" element={<AuditLogs />} />
                <Route path="/admin/testing" element={<TestingSuite />} />
              </Route>
            </Route>

            {/* Candidate Routes */}
            <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
              <Route path="/portal" element={<CandidateLayout />}>
                <Route index element={<div className="text-center">Welcome to the Candidate Portal. Please verify your identity.</div>} />
                <Route path="apply" element={<ApplicationForm />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

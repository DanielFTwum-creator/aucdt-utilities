
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AssessmentForm } from './components/student/AssessmentForm';
import { Header } from './components/shared/Header';
import { AppContext } from './contexts/AppContext';
import type { Theme, Curriculum, LecturerEvaluation, AuditLog } from './types';
import { programmes, lecturers, courses, sampleEvaluations } from './constants';

const INITIAL_CURRICULUM: Curriculum = {
  programmes,
  lecturers,
  courses,
};

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('leap-theme') as Theme;
    return savedTheme || 'light';
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<'student' | 'admin'>('student');
  
  const [curriculum, setCurriculum] = useState<Curriculum>(INITIAL_CURRICULUM);
  const [evaluations, setEvaluations] = useState<LecturerEvaluation[]>(sampleEvaluations);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(theme);
    if(theme === 'high-contrast'){
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('leap-theme', theme);
  }, [theme]);

  const addAuditLog = useCallback((action: string, details: string = '') => {
    setAuditLogs(prev => [{ id: Date.now(), timestamp: new Date(), action, details }, ...prev]);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsAdmin(true);
    addAuditLog('Admin Login', 'Successful login.');
  }, [addAuditLog]);

  const handleLogout = useCallback(() => {
    setIsAdmin(false);
    addAuditLog('Admin Logout', 'Admin session ended.');
  }, [addAuditLog]);

  const handleAssessmentSubmit = useCallback((evaluation: Omit<LecturerEvaluation, 'id' | 'timestamp'>) => {
    const newEvaluation: LecturerEvaluation = {
      ...evaluation,
      id: `eval-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setEvaluations(prev => [...prev, newEvaluation]);
    addAuditLog('Evaluation Submitted', `For lecturer ID: ${evaluation.lecturerId}`);
  }, [addAuditLog]);

  const updateCurriculum = useCallback((newCurriculum: Curriculum) => {
      setCurriculum(newCurriculum);
      setEvaluations([]); // Clear evaluations as curriculum has changed
      addAuditLog('Curriculum Updated', 'PDF data extracted and loaded.');
  }, [addAuditLog]);

  const appContextValue = useMemo(() => ({
    theme,
    setTheme,
    curriculum,
    evaluations,
    auditLogs,
    addAuditLog,
    handleLoginSuccess,
    handleLogout,
    handleAssessmentSubmit,
    updateCurriculum,
  }), [theme, curriculum, evaluations, auditLogs, addAuditLog, handleLoginSuccess, handleLogout, handleAssessmentSubmit, updateCurriculum]);

  const renderPage = () => {
    if (currentPage === 'admin') {
      return isAdmin ? <AdminDashboard /> : <AdminLogin />;
    }
    return <AssessmentForm />;
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} isAdmin={isAdmin} />
        <main>
          {renderPage()}
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;

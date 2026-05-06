
import React, { useEffect, useState } from 'react';
import AdminPanel from './components/AdminPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AssessmentForm from './components/AssessmentForm';
import Header from './components/Header';
import LecturerDirectory from './components/LecturerDirectory';
import PasswordModal from './components/PasswordModal';
import ProgrammeDirectory from './components/ProgrammeDirectory';
import ResultsView from './components/ResultsView';
import StudentDashboard from './components/StudentDashboard';
import { ADD_LOG } from './hooks/actions';
import { useAppStore } from './hooks/useAppStore';
import { authService } from './services/AuthService';
import type { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const { state, dispatch } = useAppStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('lecturer_assessment_token'));

  // Validate token on mount
  useEffect(() => {
    const validate = async () => {
      if (token) {
        const result = await authService.validateToken(token);
        if (result.success && result.valid) {
          dispatch({ type: 'SET_ADMIN_AUTH', payload: true });
        } else {
          dispatch({ type: 'SET_ADMIN_AUTH', payload: false });
          setToken(null);
          localStorage.removeItem('lecturer_assessment_token');
        }
      }
    };
    validate();
  }, [token, dispatch]);

  const handleTabChange = (tab: Tab) => {
    if (tab === 'Admin' && !state.isAdminAuthenticated) {
      setIsPasswordModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    setIsAuthenticating(true);
    try {
      // Using 'admin' as default username for this system's simple auth context
      const result = await authService.login('admin', password);
      
      if (result.success && result.token) {
        setToken(result.token);
        localStorage.setItem('lecturer_assessment_token', result.token);
        dispatch({ type: 'SET_ADMIN_AUTH', payload: true });
        dispatch({
          type: ADD_LOG,
          payload: {
            action: "Admin Login",
            message: "Administrator access granted via Auth API.",
          },
        });
        setActiveTab('Admin');
        setIsPasswordModalOpen(false);
      } else {
        alert(result.message || 'Incorrect password');
      }
    } catch (error) {
       alert('Authentication service unavailable');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <StudentDashboard />;
      case 'Programmes':
        return <ProgrammeDirectory />;
      case 'Submit Assessment':
        return <AssessmentForm onFormSubmit={() => setActiveTab('Results')} />;
      case 'Results':
        return <ResultsView />;
      case 'Lecturers':
        return <LecturerDirectory />;
      case 'Analytics':
        return <AnalyticsDashboard />;
      case 'Admin':
        return state.isAdminAuthenticated ? <AdminPanel /> : null;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-background text-brand-text-primary">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      {isPasswordModalOpen && (
        <PasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
          isAuthenticating={isAuthenticating}
        />
      )}
    </div>
  );
};

export default App;
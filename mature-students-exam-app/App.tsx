
import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentExperience } from './components/student/StudentExperience';
import { Loader } from './components/common/Loader';
import { Question } from './types';
import { defaultQuestions } from './data/defaultQuestions';

const App: React.FC = () => {
  const { user, isAuthReady, isAdmin, handleSignOut } = useAuth();
  const [viewAsStudent, setViewAsStudent] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(defaultQuestions);

  useEffect(() => {
    // When an admin logs in, default to admin view
    if (isAdmin) {
      setViewAsStudent(false);
    }
  }, [isAdmin]);

  const handleLoadExamForStudent = (questions: Question[]) => {
    setActiveQuestions(questions);
  };

  if (!isAuthReady) {
    return <Loader fullScreen message="Initializing Application..." />;
  }

  const shouldShowAdminView = isAdmin && !viewAsStudent;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-5xl mx-auto">
        {shouldShowAdminView ? (
          <AdminDashboard 
            onViewAsStudent={() => setViewAsStudent(true)} 
            onLoadExam={handleLoadExamForStudent}
            onSignOut={handleSignOut}
          />
        ) : (
          <StudentExperience 
            initialQuestions={activeQuestions}
            isAdmin={isAdmin}
            onReturnToAdmin={() => setViewAsStudent(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;

import React, { useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProgressBarCircular from '../components/ProgressBarCircular';
import ModuleCard from '../components/ModuleCard';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    modules,
    userProgress,
    overallProgress,
    currentStreak,
    totalTimeSpent,
    nextRecommendedAction,
    isLoadingProgress,
    initializeUserProgress,
  } = useProgress();

  useEffect(() => {
    if (user?.id) {
      // Re-initialize progress if user changes or on first load (already handled by context)
      // This empty dependency array is to prevent re-running initializeUserProgress on every render
      // eslint-disable-next-line react-hooks/exhaustive-deps
      initializeUserProgress(user.id);
    }
  }, [user]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (isLoadingProgress) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const firstLockedModule = modules.find(m => m.locked);
  const nextActionLink = firstLockedModule ? `${ROUTES.MODULES}/${firstLockedModule.id}` : ROUTES.PORTFOLIO; // Example

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Welcome Card & Overall Progress */}
        <Card className="flex-1 p-6 flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:items-center">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
              Welcome back, {user?.fullName.split(' ')[0]}!
            </h1>
            <p className="text-xl text-subtle-text-light dark:text-subtle-text-dark">
              You're <span className="font-semibold text-primary">{overallProgress}%</span> through the course.
            </p>
            {nextRecommendedAction && (
              <div className="mt-4">
                <Link to={nextActionLink}> {/* This link needs to be dynamic based on nextRecommendedAction */}
                  <Button variant="primary" size="md">
                    {nextRecommendedAction} <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <ProgressBarCircular value={overallProgress} size={150} strokeWidth={12} />
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 w-full lg:w-1/3">
          <Card className="p-4 text-center">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Current Streak</h3>
            <p className="text-3xl font-bold text-primary">{currentStreak} days</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Total Time Spent</h3>
            <p className="text-3xl font-bold text-success">{formatTime(totalTimeSpent)}</p>
          </Card>
        </div>
      </div>

      {/* Your Modules Section */}
      <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">Your Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            progress={userProgress.find(p => p.moduleNumber === module.id)}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
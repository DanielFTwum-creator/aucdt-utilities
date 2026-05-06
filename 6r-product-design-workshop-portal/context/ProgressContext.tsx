import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Module,
  ModuleProgress,
  ProgressContextType,
  BadgeLevel,
  ModuleStatus
} from '../types';
import { MODULES_DATA, BADGE_THRESHOLDS } from '../constants';
import { useAuth } from './AuthContext';
import * as moduleService from '../services/moduleService';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [userProgress, setUserProgress] = useState<ModuleProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0); // Days active consecutively
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0); // In seconds
  const [nextRecommendedAction, setNextRecommendedAction] = useState<string>('');
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);

  const modules: Module[] = MODULES_DATA; // All modules data from constants

  const calculateOverallProgress = useCallback((progress: ModuleProgress[]) => {
    if (progress.length === 0) return 0;
    const completedModules = progress.filter(p => p.status === 'completed').length;
    return Math.round((completedModules / modules.length) * 100);
  }, [modules.length]);

  const getBadgeLevel = useCallback((score: number): BadgeLevel => {
    if (score >= BADGE_THRESHOLDS.gold) return 'gold';
    if (score >= BADGE_THRESHOLDS.silver) return 'silver';
    if (score >= BADGE_THRESHOLDS.bronze) return 'bronze';
    return 'none';
  }, []);

  const initializeUserProgress = useCallback(async (userId: string) => {
    if (!userId) {
      setUserProgress([]);
      setOverallProgress(0);
      setIsLoadingProgress(false);
      setNextRecommendedAction(''); // Clear action if no user
      return;
    }
    setIsLoadingProgress(true);
    try {
      const fetchedProgress = await moduleService.fetchUserProgress(userId, modules);
      setUserProgress(fetchedProgress);
      const calculatedOverallProgress = calculateOverallProgress(fetchedProgress); // Use local variable
      setOverallProgress(calculatedOverallProgress);
      // Simulate streak and time spent
      setCurrentStreak(Math.floor(Math.random() * 7) + 1); // 1-7 days
      setTotalTimeSpent(fetchedProgress.reduce((sum, p) => sum + (p.completedAt ? (new Date(p.completedAt).getTime() - new Date(p.startedAt).getTime()) / 1000 : 0), 0));
      // Determine next recommended action using the local calculatedOverallProgress
      const nextModule = fetchedProgress.find(p => p.status !== 'completed' && !modules.find(m => m.id === p.moduleNumber)?.locked);
      if (nextModule) {
        const moduleData = modules.find(m => m.id === nextModule.moduleNumber);
        if (moduleData) {
          if (nextModule.lessonsCompleted < moduleData.lessons.length) {
            setNextRecommendedAction(`Complete ${moduleData.id} Lesson ${nextModule.lessonsCompleted + 1}`);
          } else if (nextModule.quizzesPassed < moduleData.quizzes.length) {
            setNextRecommendedAction(`Complete ${moduleData.id} Quiz ${nextModule.quizzesPassed + 1}`);
          } else if (!nextModule.questSubmitted) {
            setNextRecommendedAction(`Complete ${moduleData.id} Quest`);
          } else { // All parts of the current nextModule are done, but it's not marked complete for some reason
            setNextRecommendedAction('Start next module'); // Fallback
          }
        } else {
          setNextRecommendedAction('Start next module'); // Module data not found
        }
      } else if (calculatedOverallProgress < 100) { // Use local variable here
        setNextRecommendedAction('Start next module');
      } else {
        setNextRecommendedAction('Review your portfolio!');
      }

    } catch (error) {
      console.error('Failed to initialize user progress:', error);
      setNextRecommendedAction('Failed to load progress.'); // Indicate failure to user
    } finally {
      setIsLoadingProgress(false);
    }
  }, [calculateOverallProgress, modules]); // Removed overallProgress from dependencies

  useEffect(() => {
    if (!isAuthLoading && user) {
      initializeUserProgress(user.id);
    } else if (!isAuthLoading && !user) {
      // Clear progress if user logs out
      setUserProgress([]);
      setOverallProgress(0);
      setIsLoadingProgress(false);
      setNextRecommendedAction('');
    }
  }, [isAuthLoading, user, initializeUserProgress]);

  const getModuleProgress = useCallback((moduleId: string) => {
    return userProgress.find(p => p.moduleNumber === moduleId);
  }, [userProgress]);

  const updateProgress = useCallback(async (
    moduleId: string,
    updates: Partial<Omit<ModuleProgress, 'id' | 'userId' | 'moduleNumber' | 'startedAt'>>
  ) => {
    if (!user) return false;
    let newProgress: ModuleProgress[] = [];
    let updated = false;

    setUserProgress(prevProgress => {
      newProgress = prevProgress.map(p => {
        if (p.moduleNumber === moduleId) {
          const updatedP = { ...p, ...updates };
          const moduleData = modules.find(m => m.id === moduleId);
          let newStatus: ModuleStatus = updatedP.status;
          let newProgressPercentage = updatedP.progressPercentage;

          if (moduleData) {
            // Update progress percentage based on lessons, quizzes, quests
            const totalSteps = moduleData.lessons.length + moduleData.quizzes.length + 1; // +1 for quest
            const completedSteps = updatedP.lessonsCompleted + updatedP.quizzesPassed + (updatedP.questSubmitted ? 1 : 0);
            newProgressPercentage = Math.min(100, Math.round((completedSteps / totalSteps) * 100));

            // Check for module completion
            if (
              updatedP.lessonsCompleted >= moduleData.lessons.length &&
              updatedP.quizzesPassed >= moduleData.quizzes.length &&
              updatedP.questSubmitted
            ) {
              newStatus = 'completed';
              updatedP.completedAt = updatedP.completedAt || new Date();
              // Assign badge if not already, using the score from the update
              if (updatedP.score !== undefined) {
                updatedP.badgeLevel = updatedP.badgeLevel || getBadgeLevel(updatedP.score);
              }
            } else if (updatedP.status === 'locked' && (updatedP.lessonsCompleted > 0 || updatedP.quizzesPassed > 0 || updatedP.questSubmitted)) {
              newStatus = 'in_progress';
            }
          }

          updated = true;
          return { ...updatedP, status: newStatus, progressPercentage: newProgressPercentage };
        }
        return p;
      });

      // If no progress found, create a new one (e.g., first lesson started)
      if (!updated && updates.lessonsCompleted && updates.lessonsCompleted > 0) {
        const moduleData = modules.find(m => m.id === moduleId);
        if (moduleData) {
          newProgress = [...prevProgress, {
            id: `progress-${user.id}-${moduleId}`,
            userId: user.id,
            moduleNumber: moduleId,
            status: 'in_progress',
            progressPercentage: Math.min(100, Math.round((1 / (moduleData.lessons.length + moduleData.quizzes.length + 1)) * 100)),
            lessonsCompleted: 1,
            quizzesPassed: 0,
            questSubmitted: false,
            score: 0,
            startedAt: new Date(),
            badgeLevel: 'none',
          }];
          updated = true;
        }
      }

      return updated ? newProgress : prevProgress;
    });

    if (updated) {
      await moduleService.saveUserProgress(user.id, newProgress);
      setOverallProgress(calculateOverallProgress(newProgress));
    }
    return updated;
  }, [user, modules, calculateOverallProgress, getBadgeLevel]);


  const updateLessonCompletion = useCallback(async (moduleId: string, lessonId: string): Promise<boolean> => {
    const currentProgress = userProgress.find(p => p.moduleNumber === moduleId);
    const moduleData = modules.find(m => m.id === moduleId);
    if (!currentProgress || !moduleData) return false;

    const lessonIndex = moduleData.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1) return false;

    const lessonsBefore = moduleData.lessons.slice(0, lessonIndex);
    const lessonsCompletedCount = currentProgress.lessonsCompleted;

    // Only update if this lesson hasn't been completed yet
    if (lessonsCompletedCount <= lessonIndex) {
      return updateProgress(moduleId, {
        lessonsCompleted: Math.max(lessonsCompletedCount, lessonIndex + 1),
        status: 'in_progress', // Ensure status is in_progress if not completed
      });
    }
    return true; // Already completed
  }, [userProgress, modules, updateProgress]);

  const updateQuizCompletion = useCallback(async (moduleId: string, quizId: string, score: number): Promise<boolean> => {
    const currentProgress = userProgress.find(p => p.moduleNumber === moduleId);
    const moduleData = modules.find(m => m.id === moduleId);
    if (!currentProgress || !moduleData) return false;

    const quizIndex = moduleData.quizzes.findIndex(q => q.id === quizId);
    if (quizIndex === -1) return false;

    const quizPassedCount = currentProgress.quizzesPassed;

    // Only update if this quiz hasn't been passed yet
    if (quizPassedCount <= quizIndex) {
      return updateProgress(moduleId, {
        quizzesPassed: Math.max(quizPassedCount, quizIndex + 1),
        score: score, // Store latest score
        badgeLevel: getBadgeLevel(score),
        status: 'in_progress',
      });
    }
    return true; // Already passed
  }, [userProgress, modules, updateProgress, getBadgeLevel]);

  const updateQuestSubmission = useCallback(async (moduleId: string, questId: string, score: number): Promise<boolean> => {
    const currentProgress = userProgress.find(p => p.moduleNumber === moduleId);
    if (!currentProgress) return false;

    // Only update if quest not submitted yet
    if (!currentProgress.questSubmitted) {
      return updateProgress(moduleId, {
        questSubmitted: true,
        score: score,
        badgeLevel: getBadgeLevel(score),
        status: 'in_progress',
      });
    }
    return true; // Already submitted
  }, [userProgress, updateProgress, getBadgeLevel]);

  const simulateTimeSpent = useCallback((seconds: number) => {
    setTotalTimeSpent(prev => prev + seconds);
    // In a real app, this would be periodically saved to backend
    // and accumulated per module
  }, []);

  const value = React.useMemo(() => ({
    modules,
    userProgress,
    overallProgress,
    currentStreak,
    totalTimeSpent,
    nextRecommendedAction,
    isLoadingProgress,
    getModuleProgress,
    updateLessonCompletion,
    updateQuizCompletion,
    updateQuestSubmission,
    initializeUserProgress,
    simulateTimeSpent,
  }), [
    modules,
    userProgress,
    overallProgress,
    currentStreak,
    totalTimeSpent,
    nextRecommendedAction,
    isLoadingProgress,
    getModuleProgress,
    updateLessonCompletion,
    updateQuizCompletion,
    updateQuestSubmission,
    initializeUserProgress,
    simulateTimeSpent,
  ]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
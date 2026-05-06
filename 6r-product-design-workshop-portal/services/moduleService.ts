import { Module, ModuleProgress, BadgeLevel, ModuleStatus } from '../types';
import { BADGE_THRESHOLDS, MODULES_DATA } from '../constants';

const USER_PROGRESS_STORAGE_KEY = 'userProgress';

// Helper to get all mock user progress
function getMockUserProgress(userId: string): ModuleProgress[] {
  const allProgress = localStorage.getItem(USER_PROGRESS_STORAGE_KEY);
  const parsedProgress = allProgress ? JSON.parse(allProgress) : {};
  return parsedProgress[userId] || [];
}

// Helper to save all mock user progress
export async function saveUserProgress(userId: string, progress: ModuleProgress[]): Promise<void> {
  const allProgress = localStorage.getItem(USER_PROGRESS_STORAGE_KEY);
  const parsedProgress = allProgress ? JSON.parse(allProgress) : {};
  parsedProgress[userId] = progress;
  localStorage.setItem(USER_PROGRESS_STORAGE_KEY, JSON.stringify(parsedProgress));
  return Promise.resolve();
}

// Simulate fetching user progress
export async function fetchUserProgress(userId: string, allModules: Module[]): Promise<ModuleProgress[]> {
  const storedProgress = getMockUserProgress(userId);

  // Ensure all modules have an entry for the user, initializing if missing
  const completeProgress: ModuleProgress[] = allModules.map(module => { // Fix: Explicitly type `completeProgress` as `ModuleProgress[]`
    const existing = storedProgress.find(p => p.moduleNumber === module.id);
    if (existing) {
      // Re-evaluate badge level based on latest score (if any)
      // Fix: Check if score exists before using it
      if (existing.score !== undefined) {
        existing.badgeLevel = getBadgeLevel(existing.score);
      }
      return existing;
    } else {
      // Determine if module should be locked
      const isFirstModule = module.id === allModules[0].id;
      const status: ModuleStatus = isFirstModule ? 'in_progress' : 'locked'; // First module always 'in_progress' by default

      return {
        id: `progress-${userId}-${module.id}`,
        userId: userId,
        moduleNumber: module.id,
        status: status,
        progressPercentage: 0,
        lessonsCompleted: 0,
        quizzesPassed: 0,
        questSubmitted: false,
        score: 0, // Fix: Initialize score to 0
        startedAt: new Date(),
        badgeLevel: 'none', // Fix: Ensure badgeLevel is of type 'BadgeLevel'
      };
    }
  });

  // Apply progressive unlocking
  let unlockedSuccessfully = true;
  while(unlockedSuccessfully) {
    unlockedSuccessfully = false;
    for (let i = 0; i < completeProgress.length; i++) {
      const currentModuleProgress = completeProgress[i];
      const currentModuleData = allModules.find(m => m.id === currentModuleProgress.moduleNumber);

      if (!currentModuleData) continue; // Should not happen

      // Only unlock if the previous module is completed AND the current one is locked
      if (i > 0) {
        const previousModuleProgress = completeProgress[i - 1];
        if (previousModuleProgress && previousModuleProgress.status === 'completed' && currentModuleProgress.status === 'locked') {
          // Unlock this module and set to in_progress
          currentModuleProgress.status = 'in_progress';
          currentModuleProgress.startedAt = currentModuleProgress.startedAt || new Date();
          unlockedSuccessfully = true;
        }
      }
    }
  }

  // Fix: The previous explicit typing of completeProgress as ModuleProgress[] resolves the assignment error.
  await saveUserProgress(userId, completeProgress); // Save any new entries or updates
  return completeProgress;
}

// Simulate updating lesson completion
export async function updateLessonCompletion(userId: string, moduleId: string, lessonId: string): Promise<boolean> {
  const progress = getMockUserProgress(userId);
  const moduleProgress = progress.find(p => p.moduleNumber === moduleId);
  const moduleData = MODULES_DATA.find(m => m.id === moduleId);

  if (!moduleProgress || !moduleData) return false;

  const lessonIndex = moduleData.lessons.findIndex(l => l.id === lessonId);
  if (lessonIndex === -1) return false;

  // Only mark as complete if it's the next sequential lesson
  if (moduleProgress.lessonsCompleted === lessonIndex) {
    moduleProgress.lessonsCompleted++;
    moduleProgress.status = 'in_progress';
    updateModuleProgressPercentage(moduleProgress, moduleData);
    await saveUserProgress(userId, progress);
    return true;
  }
  return false; // Lesson already completed or out of sequence
}

// Simulate updating quiz completion
export async function updateQuizCompletion(userId: string, moduleId: string, quizId: string, score: number): Promise<boolean> {
  const progress = getMockUserProgress(userId);
  const moduleProgress = progress.find(p => p.moduleNumber === moduleId);
  const moduleData = MODULES_DATA.find(m => m.id === moduleId);

  if (!moduleProgress || !moduleData) return false;

  const quizIndex = moduleData.quizzes.findIndex(q => q.id === quizId);
  if (quizIndex === -1) return false;

  // Only mark as complete if it's the next sequential quiz and score is passing
  const passingScore = moduleData.quizzes[quizIndex].passScore;
  if (moduleProgress.quizzesPassed === quizIndex && score >= passingScore) {
    moduleProgress.quizzesPassed++;
    moduleProgress.status = 'in_progress';
    // Optionally store the score and badge for the quest, which influences module badge
    // Fix: 'score' property exists on ModuleProgress type
    moduleProgress.score = score;
    moduleProgress.badgeLevel = getBadgeLevel(score);
    updateModuleProgressPercentage(moduleProgress, moduleData);
    await saveUserProgress(userId, progress);
    return true;
  }
  return false; // Quiz already passed or score too low
}

// Simulate updating quest submission
export async function updateQuestSubmission(userId: string, moduleId: string, questId: string, score: number): Promise<boolean> {
  const progress = getMockUserProgress(userId);
  const moduleProgress = progress.find(p => p.moduleNumber === moduleId);
  const moduleData = MODULES_DATA.find(m => m.id === moduleId);

  if (!moduleProgress || !moduleData) return false;

  if (!moduleProgress.questSubmitted) {
    moduleProgress.questSubmitted = true;
    moduleProgress.status = 'in_progress';
    // Fix: 'score' property exists on ModuleProgress type
    moduleProgress.score = score; // Store score from quest feedback
    moduleProgress.badgeLevel = getBadgeLevel(score); // Assign badge based on quest score
    updateModuleProgressPercentage(moduleProgress, moduleData);
    await saveUserProgress(userId, progress);
    return true;
  }
  return false; // Quest already submitted
}

// Helper to calculate module progress percentage
function updateModuleProgressPercentage(moduleProgress: ModuleProgress, moduleData: Module) {
  const totalSteps = moduleData.lessons.length + moduleData.quizzes.length + moduleData.quests.length;
  const completedSteps = moduleProgress.lessonsCompleted + moduleProgress.quizzesPassed + (moduleProgress.questSubmitted ? moduleData.quests.length : 0);
  moduleProgress.progressPercentage = Math.min(100, Math.round((completedSteps / totalSteps) * 100));

  // If all conditions met, mark as completed
  if (
    moduleProgress.lessonsCompleted >= moduleData.lessons.length &&
    moduleProgress.quizzesPassed >= moduleData.quizzes.length &&
    moduleProgress.questSubmitted
  ) {
    moduleProgress.status = 'completed';
    moduleProgress.completedAt = new Date();
  }
}

// Helper to determine badge level
function getBadgeLevel(score: number): BadgeLevel {
  if (score >= BADGE_THRESHOLDS.gold) return 'gold';
  if (score >= BADGE_THRESHOLDS.silver) return 'silver';
  if (score >= BADGE_THRESHOLDS.bronze) return 'bronze';
  return 'none';
}
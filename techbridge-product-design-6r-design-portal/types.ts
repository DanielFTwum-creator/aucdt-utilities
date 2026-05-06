
export enum ModuleStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  LOCKED = 'locked'
}

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface User {
  name: string;
  initials: string;
  enrolledAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

export interface WorkshopModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
  quizzes: QuizQuestion[];
  duration: string;
  status: ModuleStatus;
  progress: number;
  color: string;
}

export interface UserStats {
  overallProgress: number;
  modulesCompleted: number;
  timeInvested: string;
  level: string;
}

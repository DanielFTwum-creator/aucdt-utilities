
export enum UserRole {
  ADMIN = 'System Admin',
  QUIZ_ADMIN = 'Quiz Admin',
  EVALUATOR = 'Technical Evaluator',
  CANDIDATE = 'Candidate'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  CONTRAST = 'contrast'
}

export enum QuestionType {
  MCQ = 'Multiple Choice',
  MULTI_SELECT = 'Multiple Response',
  CODE = 'Code Challenge',
  SHORT_ANSWER = 'Short Answer',
  SCENARIO = 'Scenario-based',
  PROJECT = 'Take-Home Project'
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export interface AuditLog {
  id: string;
  timestamp: number;
  user: string;
  action: string;
  details: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  category: string;
  difficulty: Difficulty;
  content: string;
  options?: string[];
  correctAnswer?: string | string[];
  idealAnswer?: string;
  points: number;
  tags: string[];
}

export interface TakeHomeProject {
  id: string;
  title: string;
  duration: string;
  difficulty: Difficulty;
  overview: string;
  userStories: string[];
  technicalConstraints: string[];
  apiSpecs: { method: string; path: string; description: string }[];
  databaseSchema: string[];
  bonusTasks: string[];
  rubric: { criterion: string; weight: number }[];
  boilerplateUrl: string;
}

export interface QuizTemplate {
  id: string;
  name: string;
  category: 'Technical Screen' | 'Culture Fit' | 'Final Assessment';
  timeLimit: number; 
  questions: string[]; 
  passThreshold: number;
}

export type ViewState = 'DASHBOARD' | 'QUESTIONS' | 'QUIZZES' | 'ASSESSMENTS' | 'CANDIDATE_PLAYER' | 'EVALUATOR_REVIEW' | 'TAKE_HOME' | 'SYSTEM_DOCS' | 'DIAGNOSTICS';

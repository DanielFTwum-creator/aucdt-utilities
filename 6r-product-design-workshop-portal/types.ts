import React from 'react';

// --- User & Authentication Types ---
export type UserRole = 'learner' | 'educator' | 'admin';

export interface OnboardingData {
  // Fix: Renamed 'role' to 'onboardingUserRole' to avoid conflict with User.role
  onboardingUserRole: string;
  experienceLevel: string;
  primaryGoal: string;
  availableHours: string;
  learningStyle: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  password_hash: string; // Fix: Added for mock authentication service
  avatarUrl?: string;
  role: UserRole;
  onboardingCompleted: boolean;
  onboardingData?: OnboardingData;
  createdAt: Date;
  lastLogin: Date;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserOnboarding: (data: OnboardingData) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
}

// --- Module & Progress Types ---
export type ModuleStatus = 'locked' | 'in_progress' | 'completed';
export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'none';

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: string;
  transcription: string;
  codeExample?: CodeExample;
}

export interface CodeExample {
  language: string;
  code: string;
  sandboxUrl?: string;
}

export interface QuizQuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single-choice' | 'multi-choice' | 'true-false';
  options: QuizQuestionOption[];
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  passScore: number; // e.g., 80 for 80%
  questions: QuizQuestion[];
}

export type QuestType = 'design-audit' | 'wireframing' | 'design-system' | 'code-submission' | 'text-submission' | 'image-submission';

export interface Quest {
  id: string;
  title: string;
  type: QuestType;
  description: string;
  submissionGuide?: string[]; // Optional: steps for submission
  aiFeedbackCriteria?: string[]; // Optional: what AI will look for
}

export interface Resource {
  name: string;
  url: string;
}

export interface Module {
  id: string; // e.g., R1, R2
  name: string; // e.g., Review, Reimagine
  theme: string;
  description: string;
  lessons: Lesson[];
  quizzes: Quiz[];
  quests: Quest[];
  resources: Resource[];
  locked?: boolean;
  timeEstimate?: string;
}

export interface ModuleProgress {
  id: string;
  userId: string;
  moduleNumber: string; // Corresponds to Module.id
  status: ModuleStatus;
  progressPercentage: number; // 0-100
  lessonsCompleted: number;
  quizzesPassed: number;
  questSubmitted: boolean;
  score?: number; // Fix: Added score to ModuleProgress
  startedAt: Date;
  completedAt?: Date;
  badgeLevel: BadgeLevel;
}

export interface ProgressContextType {
  modules: Module[];
  userProgress: ModuleProgress[];
  overallProgress: number;
  currentStreak: number;
  totalTimeSpent: number;
  nextRecommendedAction: string;
  isLoadingProgress: boolean;
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;
  updateLessonCompletion: (moduleId: string, lessonId: string) => Promise<boolean>;
  updateQuizCompletion: (moduleId: string, quizId: string, score: number) => Promise<boolean>;
  updateQuestSubmission: (moduleId: string, questId: string, score: number) => Promise<boolean>;
  initializeUserProgress: (userId: string) => Promise<void>;
  simulateTimeSpent: (seconds: number) => void;
}

// --- Quest Submission Types ---
export type SubmissionStatus = 'pending' | 'reviewed' | 'failed';

export interface QuestSubmission {
  id: string;
  userId: string;
  questId: string;
  moduleNumber: string;
  submissionData: any; // Can be text, JSON for design tokens, file URLs
  fileUrls?: string[]; // For image/file uploads
  aiFeedback?: AIResponse;
  score?: number; // 0-100
  badgeLevel?: BadgeLevel;
  attemptNumber: number;
  status: SubmissionStatus;
  submittedAt: Date;
  reviewedAt?: Date;
}

export interface AIResponse {
  score: number;
  badgeLevel: BadgeLevel;
  feedback: {
    completeness: string;
    quality: string;
    prioritization: string;
    observations: string[]; // Specific observations
    nextSteps: string[];
    tone: string; // e.g., "encouraging"
  };
}

// --- Portfolio Types ---
export type TemplateStyle = 'minimal' | 'bold' | 'academic';

export interface PortfolioSection {
  id: string;
  title: string;
  content: string | string[]; // Can be text or array of image URLs
  type: 'text' | 'image' | 'code' | 'video';
}

export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  description: string;
  sections: PortfolioSection[];
  templateStyle: TemplateStyle;
  publicToken?: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// --- Community Showcase Types ---
export type ProjectStatus = 'pending' | 'approved' | 'rejected';

export interface ShowcaseProject {
  id: string;
  title: string;
  description: string;
  heroImages: string[]; // URLs of hero images
  tags: string[];
  moduleNumber: string;
  isFeatured: boolean;
  author: string; // User's full name
  status: ProjectStatus;
  publishedAt?: Date;
  portfolioLink?: string; // Link to full portfolio
  viewCount: number;
  badgeLevel?: BadgeLevel; // Fix: Added badgeLevel for consistent filtering
}

// --- Theme Context Type ---
export type Theme = 'light' | 'dark' | 'high-contrast';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// --- Common UI Props ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
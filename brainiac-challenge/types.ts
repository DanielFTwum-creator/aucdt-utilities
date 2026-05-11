export enum View {
    SETUP = 'setup',
    QUIZ = 'quiz',
    AUDIT_LOG = 'audit_log',
    REFRESH_STATUS = 'refresh_status'
}

export enum AcademicLevel {
    PRIMARY = "Primary School",
    MIDDLE = "Middle School",
    HIGH = "High School",
    UNIVERSITY = "University"
}

export enum Difficulty {
    EASY = "Easy",
    MEDIUM = "Medium",
    HARD = "Hard",
    EXPERT = "Expert"
}

export interface QuizSettings {
    topic: string;
    level: AcademicLevel;
    numQuestions: number;
    difficulty: Difficulty;
    timeLimit: string;
}

export interface QuestionOption {
    text: string;
    isCorrect: boolean;
}

export interface ChartData {
    type: 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
    data: any; // Chart.js data object
    options?: any; // Chart.js options object
}

export interface Question {
    questionText: string;
    options: QuestionOption[];
    explanation: string;
    katexContent?: string | null;
    chartData?: ChartData | null;
}

export interface Quiz {
    id: string;
    settings: QuizSettings;
    questions: Question[];
    createdAt: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    settings: QuizSettings;
    geminiPrompt: string;
    geminiResponse: string; // The raw JSON response from Gemini
}
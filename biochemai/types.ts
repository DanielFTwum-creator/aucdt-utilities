export enum LearningLevel {
  Primary = 'Primary School',
  Secondary = 'Secondary School',
  Undergraduate = 'Undergraduate',
  PostGraduate = 'Post-Graduate',
  Professional = 'Professional',
}

export enum AppMode {
  Chat = 'Chat',
  Voice = 'Voice',
  Quiz = 'Quiz',
  Docs = 'Docs',
  Test = 'Test',
  Admin = 'Admin',
}

export enum Theme {
  Ocean = 'Ocean',
  Golden = 'Golden',
  Cyberpunk = 'Cyberpunk',
  Minimal = 'Minimal',
  Cinema = 'Cinema',
}

export enum ResponseTemplate {
  Markdown = 'Markdown',
  HTMLDocumentation = 'HTML Documentation',
  LaTeX = 'LaTeX',
  Interactive = 'Interactive',
}

export interface Source {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sources?: Source[];
  isError?: boolean;
  template?: ResponseTemplate;
}

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  imageSuggestion?: string;
}

export type ExportType = 'pdf' | 'instagram' | 'linkedin';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}
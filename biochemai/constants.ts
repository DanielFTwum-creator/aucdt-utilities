import { LearningLevel, Theme, ResponseTemplate } from './types';

export const LEARNING_LEVELS: LearningLevel[] = [
  LearningLevel.Primary,
  LearningLevel.Secondary,
  LearningLevel.Undergraduate,
  LearningLevel.PostGraduate,
  LearningLevel.Professional,
];

export const THEMES: Theme[] = [
  Theme.Ocean,
  Theme.Golden,
  Theme.Cyberpunk,
  Theme.Minimal,
  Theme.Cinema,
];

export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  ResponseTemplate.Markdown,
  ResponseTemplate.HTMLDocumentation,
  ResponseTemplate.LaTeX,
  ResponseTemplate.Interactive,
];

export const LOCAL_STORAGE_KEYS = {
  messages: 'bioChemAiMessages',
  learningLevel: 'bioChemAiLearningLevel',
  theme: 'bioChemAiTheme',
  responseTemplate: 'bioChemAiResponseTemplate',
  adminPassword: 'bioChemAiAdminPassword',
  auditLog: 'bioChemAiAuditLog',
  quizQuestionCount: 'bioChemAiQuizQuestionCount',
};

export const DEFAULT_ADMIN_PASSWORD = 'password123';
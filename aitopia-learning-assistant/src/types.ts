export interface WeekData {
  weekNum: number;
  title: string;
  theory: string[];
  practice: string[];
  assessment: string;
}

export interface CourseModule {
  title: string;
  description: string;
  weeks: WeekData[];
}

export interface SupportSystem {
  category: string;
  items: string[];
}

export interface AccessibilityFeature {
  category: string;
  items: string[];
}

export interface QAStructure {
  process: string[];
  metrics: string[];
  roadmap: { phase: string; details: string[] }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface VideoHighlight {
  timestamp: string;
  secondValue: number;
  description: string;
  significance: string;
}

export interface VideoSummary {
  summary: string;
  highlights: VideoHighlight[];
}

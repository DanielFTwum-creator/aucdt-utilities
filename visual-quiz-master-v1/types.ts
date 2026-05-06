
export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  topic: string;
  cognitive_level: string;
  svgContent: string | null;
  chartJsConfig: any | null; // Using 'any' for flexibility with the provided Chart.js configurations
}

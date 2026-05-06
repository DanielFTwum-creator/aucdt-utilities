import type firebase from 'firebase/compat/app';

export type DiagramType = 'right_triangle_abc' | 'angles_on_line' | 'pie_chart_colors' | 'chartjs_bar' | 'chartjs_line' | 'mermaid_flowchart' | 'mermaid_sequence' | 'mermaid_class';

export interface Bonus {
  title: string;
  content: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  diagram?: DiagramType;
  bonus?: Bonus;
}

export interface Exam {
  id: string;
  name: string;
  questions: string; // Stored as a JSON string
  createdAt: any;
  createdBy: string;
}

export interface AppUser extends firebase.User {
    // Extend with custom properties if needed in the future
}

export interface Answers {
  [questionId: number]: number;
}

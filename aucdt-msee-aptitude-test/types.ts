export interface Bonus {
  title: string;
  content: string;
}

export interface Question {
  id: number | string;
  question: string;
  options: string[];
  correct: number;
  diagram?: 'right_triangle_abc' | 'angles_on_line' | 'pie_chart_colors' | 'circle_radius' | 'cube_side';
  bonus?: Bonus;
}

export interface Exam {
  id: string;
  name: string;
  questions: string; // Stored as a JSON string in the database
  subject?: string;
  description?: string;
}

export interface Answers {
  [questionId: string | number]: number;
}

export interface User {
  uid: string;
  email?: string | null;
  role?: 'student' | 'admin';
}

export interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}
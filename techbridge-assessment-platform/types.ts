
export interface Assessment {
  id: string;
  title: string;
  duration: number;
  questions: number;
}

export interface Programme {
  id: string;
  name: string;
  assessments: {
    [year: string]: Assessment[];
  };
}

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface ProgrammeData {
  programmes: Programme[];
  questions: {
    [assessmentId: string]: Question[];
  };
}

export interface Results {
  score: number;
  total: number;
  answers: { [key: number]: string };
  questions: Question[];
  assessmentId: string;
  assessmentTitle: string;
}

export interface LogEntry {
    timestamp: string;
    eventType: string;
    [key: string]: any;
}

export type View = 'dashboard' | 'programmeDetail' | 'assessment' | 'results' | 'admin' | 'login';

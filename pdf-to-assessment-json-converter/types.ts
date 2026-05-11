
export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  answers: Answer[];
}

export interface Assessment {
  id: string;
  title: string;
  year: number;
  semester: number;
  questions: Question[];
}

export interface ProgramData {
  id: string;
  title: string;
  description: string;
  icon: string;
  assessments: Assessment[];
}

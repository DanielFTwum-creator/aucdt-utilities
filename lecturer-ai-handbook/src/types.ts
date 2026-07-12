export interface ExerciseState {
  userInput: string;
  isGenerating: boolean;
  output: string;
  error?: string;
  conversationHistory?: { role: 'user' | 'model'; text: string }[];
}

export interface CourseOutlineInput {
  courseName: string;
  level: string;
  studentProfile: string;
}

export interface RubricInput {
  assignmentText: string;
}

export interface LectureSlidesInput {
  topic: string;
}

export interface CommitmentState {
  task30Days: string;
  colleagueShow: string;
  questionBlocker: string;
  weeksProgress: {
    week1: boolean;
    week2: boolean;
    week3: boolean;
    week4: boolean;
  };
}

export interface SavedArtefact {
  id: string;
  title: string;
  type: 'outline' | 'rubric' | 'slides' | 'quiz' | 'feedback' | 'polish' | 'analysis' | 'custom';
  content: string;
  createdAt: string;
  tags?: string[];
}


export type Theme = 'light' | 'dark' | 'high-contrast';

export interface Programme {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  name: string;
  programmeId: string;
  lecturerIds: string[];
}

export interface Lecturer {
  id: string;
  name: string;
}

export interface Curriculum {
  programmes: Programme[];
  courses: Course[];
  lecturers: Lecturer[];
}

export type Recommendation = 'Recommend' | 'Neutral' | 'Not Recommend';

export interface Ratings {
  [key: string]: number; // Maps criterion ID to a score (e.g., 1-5)
}

export interface LecturerEvaluation {
  id: string;
  programmeId: string;
  lecturerId: string;
  courseId: string;
  semester: number;
  ratings: Ratings;
  recommend: Recommendation;
  comment: string;
  timestamp: string;
}

export interface AuditLog {
  id: number;
  timestamp: Date;
  action: string;
  details: string;
}

export interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  curriculum: Curriculum;
  evaluations: LecturerEvaluation[];
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details?: string) => void;
  handleLoginSuccess: () => void;
  handleLogout: () => void;
  handleAssessmentSubmit: (evaluation: Omit<LecturerEvaluation, 'id' | 'timestamp'>) => void;
  updateCurriculum: (newCurriculum: Curriculum) => void;
}

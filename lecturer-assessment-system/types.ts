
export type Tab = 'Dashboard' | 'Programmes' | 'Submit Assessment' | 'Results' | 'Lecturers' | 'Analytics' | 'Admin';

export interface Programme {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  name: string;
  programmeId: string;
  year: number;
  semester: number;
  quiz?: Quiz;
}

export interface Quiz {
    duration: number; // in seconds
    questions: Question[];
}

export interface Question {
    text: string;
    options: string[];
    correctAnswerIndex: number;
}


export interface Lecturer {
  id: string;
  name: string;
  programmeId: string;
}

export enum RatingCategory {
  TeachingQuality = 'Teaching Quality',
  Communication = 'Communication Skills',
  SubjectKnowledge = 'Subject Knowledge',
  Punctuality = 'Punctuality & Availability',
}

export enum Recommendation {
    HighlyRecommend = 'Highly Recommend',
    Recommend = 'Recommend',
    Neutral = 'Neutral',
    DoNotRecommend = 'Do Not Recommend',
}

export type Ratings = Record<RatingCategory, number>;

export interface Assessment {
  id: string;
  lecturerId: string;
  courseId: string;
  programmeId: string;
  semester: number;
  ratings: Ratings;
  comment: string;
  recommend: Recommendation;
  timestamp: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    message: string;
}

export interface AppState {
    programmes: Programme[];
    courses: Course[];
    lecturers: Lecturer[];
    assessments: Assessment[];
    auditLogs: AuditLog[];
    isAdminAuthenticated: boolean;
}
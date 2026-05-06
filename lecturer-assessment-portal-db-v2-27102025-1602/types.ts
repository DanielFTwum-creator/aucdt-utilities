import React from 'react';

export type DashboardTab = 'overview' | 'evaluations' | 'lecturers' | 'analytics' | 'guides' | 'admin' | 'programmes' | 'selfTest';

export interface Programme {
    id: string;
    name: string;
}

export interface Lecturer {
    id: string;
    name: string;
}

export interface Course {
    id: string;
    name: string;
    // Added relationships to support the new data model
    programmeId: string;
    lecturerIds: string[];
}

export const assessmentCriteria = {
    '1': { short: 'Knowledge', long: "The Lecturer was knowledgeable in the field of study represented by this course." },
    '2': { short: 'Responsiveness', long: "The Lecturer always responded to specific questions confidently and promptly." },
    '3': { short: 'Punctuality', long: "The Lecturer was always regular and punctual in class." },
    '4': { short: 'Course Structure', long: "The structure of the course reflected the course objectives." },
    '5': { short: 'Relevance', long: "Course content is relevant and current." },
    '6': { short: 'Learning Enhancement', long: "Assignments, resources, and exams enhanced learning." },
    '7': { short: 'Assignment Feedback', long: "My assignments were graded in a reasonable amount of time with constructive feedback from the lecturer." },
    '8': { short: 'Fair Evaluation', long: "Testing and evaluation was valid, thorough and fair." },
    '9': { short: 'Critical Thinking', long: "Attention was given to enhancing students' writing, learning, and critical thinking skills." },
    '10': { short: 'Inclusive Environment', long: "The Lecturer created a respectful and inclusive learning environment." },
    '11': { short: 'Stimulating Materials', long: "Lectures and study materials stimulated class involvement, interest and achievement." },
    '12': { short: 'Effective Time Use', long: "The Lecturer made effective use of lecture time (audio and/or video, reading assignments, and other resources)." },
    '13': { short: 'Effective Tools', long: "The Lecturer used instructional techniques and tools (forums, chats, collaboration projects, and other activities) effectively." },
    '14': { short: 'Availability', long: "The Lecturer was available to students for assistance during the posted office hours." },
    '15': { short: 'Clear Communication', long: "Course objectives, content and assessment methods were clearly communicated to students." },
    '16': { short: 'Student Participation', long: "The Lecturer allows and encourages student participation." },
    '17': { short: 'Creativity & Research', long: "The Lecturer encourages research, creativity, and a forward-looking spirit in students." },
    '18': { short: 'Interaction Facilitation', long: "The Lecturer facilitates student-student and student-lecturer interaction." },
    '19': { short: 'Encouraging Questions', long: "The Lecturer encourages students to engage in class discussions and ask questions." },
    '20': { short: 'Teaching Style', long: "The Lecturer's teaching style is enthusiastic and stimulating." }
} as const;

export const assessmentSections = {
    'Section 1: Lecturer\'s Delivery & Knowledge': ['1', '2', '3', '15', '20'] as RatingCategory[],
    'Section 2: Course Content & Structure': ['4', '5', '6', '11', '12'] as RatingCategory[],
    'Section 3: Assessment & Feedback': ['7', '8', '9', '17'] as RatingCategory[],
    'Section 4: Learning Environment & Engagement': ['10', '13', '14', '16', '18', '19'] as RatingCategory[],
};
export type AssessmentSectionTitle = keyof typeof assessmentSections;


export type RatingCategory = keyof typeof assessmentCriteria;

export type Recommendation = 'Recommend' | 'Not Recommend' | 'Neutral';

export interface LecturerEvaluation {
    id:string;
    programmeId: string;
    lecturerId: string;
    courseId: string;
    semester: number;
    ratings: Record<RatingCategory, number>;
    recommend: Recommendation;
    comment: string;
    timestamp: string;
    htmlEmailBody?: string;
}

export interface FormData {
    programme: string;
    lecturer: string;
    course: string;
    semester: number;
    ratings: Record<RatingCategory, number>;
    recommend: Recommendation;
    comment: string;
}

export interface Statistics {
    totalEvaluations: number;
    averageOverallRating: string;
    recommendationRate: string;
}

export interface RatingCardProps {
    label: string;
    rating: number;
    icon: React.ReactNode;
}

export interface ProgrammeAnalytics {
    id: string;
    name: string;
    lecturerCount: number;
    courseCount: number;
    evaluationCount: number;
    avgRating: string;
    recommendationRate: string;
}

export interface LecturerSummary {
    id: string;
    name: string;
    programmesTaught: { id: string; name: string }[];
    coursesTaught: Course[];
    evaluationCount: number;
    avgRating: string;
    recommendationRate: string;
}

// For PDF Extractor
export interface ExtractedCourse {
    courseId: string;
    courseName: string;
    lecturers: string[];
}

export interface ExtractedProgramme {
    programmeId: string;
    programmeName: string;
    courses: ExtractedCourse[];
}

export interface AuditLog {
    id: string;
    timestamp: string;
    event: string;
    status: 'Success' | 'Failure' | 'Info';
    details: string;
}

// For Self-Testing Suite
export interface TestResult {
    success: boolean;
    log: string;
    duration: number;
    screenshotDataUrl?: string;
}

export interface Test {
    title: string;
    run: () => Promise<TestResult>;
}
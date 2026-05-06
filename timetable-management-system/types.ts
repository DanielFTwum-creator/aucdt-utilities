
export enum UserRole {
    ADMIN = 'Administrator',
    LECTURER = 'Lecturer',
    STUDENT = 'Student',
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
}

export interface Course {
    id: string;
    name: string;
    code: string;
}

export interface Lecturer {
    id: string;
    name: string;
}

export interface Venue {
    id: string;
    name: string;
}

export interface TimetableEvent {
    id: string;
    courseId: string;
    lecturerId: string;
    venueId: string;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
}

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    timestamp: string;
}

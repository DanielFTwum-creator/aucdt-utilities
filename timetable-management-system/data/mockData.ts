
import { User, UserRole, Course, Lecturer, Venue, TimetableEvent, Notification, AuditLog } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'admin-01', name: 'Dr. Evelyn Reed', role: UserRole.ADMIN },
  { id: 'lecturer-01', name: 'Prof. Alan Grant', role: UserRole.LECTURER },
  { id: 'student-01', name: 'Alex Johnson', role: UserRole.STUDENT },
];

export const MOCK_COURSES: Course[] = [
  { id: 'course-01', name: 'Advanced Typography', code: 'DES301' },
  { id: 'course-02', name: 'Interaction Design', code: 'TECH205' },
  { id: 'course-03', name: 'History of Modern Art', code: 'ART101' },
  { id: 'course-04', name: 'Web Technologies', code: 'TECH310' },
];

export const MOCK_LECTURERS: Lecturer[] = [
  { id: 'lecturer-01', name: 'Prof. Alan Grant' },
  { id: 'lecturer-02', name: 'Dr. Ellie Sattler' },
  { id: 'lecturer-03', name: 'Mr. Ian Malcolm' },
];

export const MOCK_VENUES: Venue[] = [
  { id: 'venue-01', name: 'Design Studio A' },
  { id: 'venue-02', name: 'Lecture Hall B' },
  { id: 'venue-03', name: 'Computer Lab C' },
];

export const MOCK_TIMETABLE: TimetableEvent[] = [
  { id: 'event-01', courseId: 'course-01', lecturerId: 'lecturer-02', venueId: 'venue-01', day: 'Monday', startTime: '09:00', endTime: '11:00' },
  { id: 'event-02', courseId: 'course-02', lecturerId: 'lecturer-01', venueId: 'venue-03', day: 'Monday', startTime: '13:00', endTime: '15:00' },
  { id: 'event-03', courseId: 'course-03', lecturerId: 'lecturer-03', venueId: 'venue-02', day: 'Tuesday', startTime: '10:00', endTime: '12:00' },
  { id: 'event-04', courseId: 'course-04', lecturerId: 'lecturer-01', venueId: 'venue-03', day: 'Wednesday', startTime: '11:00', endTime: '13:00' },
  { id: 'event-05', courseId: 'course-01', lecturerId: 'lecturer-02', venueId: 'venue-01', day: 'Wednesday', startTime: '15:00', endTime: '17:00' },
  { id: 'event-06', courseId: 'course-02', lecturerId: 'lecturer-01', venueId: 'venue-03', day: 'Thursday', startTime: '09:00', endTime: '11:00' },
  { id: 'event-07', courseId: 'course-03', lecturerId: 'lecturer-03', venueId: 'venue-02', day: 'Friday', startTime: '14:00', endTime: '16:00' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-01', message: 'Class "Advanced Typography" on Monday has been moved to Design Studio B.', timestamp: '2025-08-19T10:00:00Z', read: false },
  { id: 'notif-02', message: 'Reminder: "Interaction Design" project deadline is this Friday.', timestamp: '2025-08-18T15:30:00Z', read: false },
  { id: 'notif-03', message: 'Welcome to the new semester! Your timetable is now available.', timestamp: '2025-08-15T09:00:00Z', read: true },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-01', userId: 'admin-01', userName: 'Dr. Evelyn Reed', action: 'Generated master timetable', timestamp: '2025-08-14T11:05:21Z' },
  { id: 'log-02', userId: 'admin-01', userName: 'Dr. Evelyn Reed', action: 'Updated course details for DES301', timestamp: '2025-08-15T09:30:15Z' },
  { id: 'log-03', userId: 'admin-01', userName: 'Dr. Evelyn Reed', action: 'Exported timetable data', timestamp: '2025-08-16T17:00:05Z' },
  { id: 'log-04', userId: 'admin-01', userName: 'Dr. Evelyn Reed', action: 'Manually adjusted event-03', timestamp: '2025-08-17T14:12:45Z' },
];


import type { AppState, Assessment, AuditLog, Course, Lecturer, Programme } from '../types';
import {
    ADD_ASSESSMENT,
    ADD_LOG,
    IMPORT_ASSESSMENTS,
    SET_ADMIN_AUTH,
    UPDATE_CURRICULUM
} from './actions';

export type AppAction =
  | { type: typeof ADD_ASSESSMENT; payload: Assessment }
  | { type: typeof IMPORT_ASSESSMENTS; payload: Assessment[] }
  | { type: typeof ADD_LOG; payload: { action: string, message: string } }
  | { type: typeof SET_ADMIN_AUTH; payload: boolean }
  | { type: typeof UPDATE_CURRICULUM; payload: { programmeId: string; lecturers: { name: string }[], courses: { name: string, year: number, semester: number }[] } };

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case ADD_ASSESSMENT:
      return {
        ...state,
        assessments: [...state.assessments, action.payload],
      };
    case IMPORT_ASSESSMENTS:
        return {
            ...state,
            assessments: action.payload
        };
    case ADD_LOG:
      const newLog: AuditLog = {
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      return {
        ...state,
        auditLogs: [newLog, ...state.auditLogs],
      };
    case SET_ADMIN_AUTH:
        return {
            ...state,
            isAdminAuthenticated: action.payload,
        };
    case UPDATE_CURRICULUM:
        const { programmeId, lecturers, courses } = action.payload;

        const newLecturers: Lecturer[] = lecturers.map(l => ({
            id: `lec_${programmeId}_${Math.random().toString(36).substr(2, 9)}`,
            name: l.name,
            programmeId,
        }));

        const newCourses: Course[] = courses.map(c => ({
            id: `course_${programmeId}_${Math.random().toString(36).substr(2, 9)}`,
            name: c.name,
            year: c.year,
            semester: c.semester,
            programmeId
        }));

        // Filter out old lecturers and courses for the specific programme
        const remainingLecturers = state.lecturers.filter(l => l.programmeId !== programmeId);
        const remainingCourses = state.courses.filter(c => c.programmeId !== programmeId);
        
        return {
            ...state,
            lecturers: [...remainingLecturers, ...newLecturers],
            courses: [...remainingCourses, ...newCourses],
        }

    default:
      return state;
  }
};
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Service Functions
export const apiService = {
  // Programmes
  getProgrammes: () => api.get('/programmes'),
  getProgrammeById: (id) => api.get(`/programmes/${id}`),
  createProgramme: (data) => api.post('/programmes', data),
  updateProgramme: (id, data) => api.put(`/programmes/${id}`, data),
  deleteProgramme: (id) => api.delete(`/programmes/${id}`),

  // Courses
  getCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getCoursesByProgramme: (programmeId) => api.get(`/courses/programme/${programmeId}`),
  getCoursesByProgrammeAndSemester: (programmeId, semester) => 
    api.get(`/courses/programme/${programmeId}/semester/${semester}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),

  // Lecturers
  getLecturers: () => api.get('/lecturers'),
  getLecturerById: (id) => api.get(`/lecturers/${id}`),
  searchLecturers: (query) => api.get(`/lecturers/search?query=${query}`),
  createLecturer: (data) => api.post('/lecturers', data),
  updateLecturer: (id, data) => api.put(`/lecturers/${id}`, data),
  deleteLecturer: (id) => api.delete(`/lecturers/${id}`),

  // Evaluations
  submitEvaluation: (data) => api.post('/evaluations/submit', data),
  getEvaluationsByLecturer: (lecturerId) => api.get(`/evaluations/lecturer/${lecturerId}`),
  getEvaluationsByCourse: (courseId) => api.get(`/evaluations/course/${courseId}`),
  getAllEvaluations: () => api.get('/evaluations/all'),

  // Audit Logs
  getAuditLogs: () => api.get('/audit-logs'),
  getAuditLogsByEventType: (eventType) => api.get(`/audit-logs/event-type/${eventType}`),

  // Authentication
  login: (password) => api.post('/auth/login', { password }),
  verify: () => api.post('/auth/verify'),

  // PDF Extraction
  extractPdf: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/pdf/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  processCurriculum: (extractedText) => 
    api.post('/pdf/process-curriculum', { extractedText }),

  // Health Check
  health: () => api.get('/health'),
};

export default api;


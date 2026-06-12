import axios from 'axios';
import { getAccessToken, refreshToken } from './wmsAuth';

// LEMS API is the WMS-hosted module (/api/lems/**). Auth = WMS JWT (in memory).
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'https://wms.techbridge.edu.gh/api/lems';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // refresh cookie rides along for the 401-retry
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  // The legacy backend wrapped everything as {success, message, data}; the WMS
  // module returns raw JSON. Re-wrap here so the components stay untouched.
  (res) => {
    res.data = { success: true, message: '', data: res.data };
    return res;
  },
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;
      const token = await refreshToken();
      if (token) {
        original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions (legacy surface preserved; unsupported calls fail loudly)
export const apiService = {
  // Programmes
  getProgrammes: () => api.get('/programmes'),
  createProgramme: (data) => api.post('/programmes', data),
  updateProgramme: (id, data) => api.put(`/programmes/${id}`, data),
  deleteProgramme: (id) => api.delete(`/programmes/${id}`),

  // Courses
  getCourses: () => api.get('/courses'),
  getCourseById: async (id) => {
    const res = await api.get('/courses');
    const found = (res.data.data || []).find((c) => c.id === Number(id));
    res.data = { success: !!found, message: found ? '' : 'Course not found', data: found };
    return res;
  },
  getCoursesByProgramme: async (programmeId) => {
    const res = await api.get('/courses');
    res.data = {
      success: true,
      message: '',
      data: (res.data.data || []).filter((c) => c.programme?.id === Number(programmeId)),
    };
    return res;
  },
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),

  // Lecturers
  getLecturers: () => api.get('/lecturers'),
  createLecturer: (data) => api.post('/lecturers', data),
  updateLecturer: (id, data) => api.put(`/lecturers/${id}`, data),
  deleteLecturer: (id) => api.delete(`/lecturers/${id}`),

  // Evaluations
  submitEvaluation: (data) => api.post('/evaluations/submit', data),
  getEvaluationsByLecturer: (lecturerId) => api.get(`/evaluations/lecturer/${lecturerId}`),
  getEvaluationsByCourse: (courseId) => api.get(`/evaluations/course/${courseId}`),
  getAllEvaluations: () => api.get('/evaluations/all'),

  // Audit Logs
  getAuditLogs: () => api.get('/audit'),

  // PDF Extraction — not yet available in the WMS-hosted module.
  extractPdf: () =>
    Promise.reject(new Error('PDF extraction is not yet available in the WMS-hosted LEMS.')),

  // Health (module rides on the WMS service)
  health: () => api.get('/programmes'),
};

export default api;

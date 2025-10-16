import axios from 'axios';

// Base URL resolution: prefer REACT_APP_API_BASE_URL, fallback to window._env_ (runtime), else ''
const BASE_API = process.env.REACT_APP_API_BASE_URL || (typeof window !== 'undefined' && window._env_?.REACT_APP_API_BASE_URL) || '';
const ATT_PREFIX = '/api/attendance';

const api = axios.create({
  baseURL: BASE_API,
  withCredentials: true,
});

// Simple list for today
export const getTodayAttendances = async (params = {}) => {
  const { data } = await api.get(`${ATT_PREFIX}/today`, { params });
  return data;
};

// Sessions by class
export const getSessionsByClass = async (classId, params = {}) => {
  const { data } = await api.get(`${ATT_PREFIX}/sessions/class/${classId}`, { params });
  return data;
};

// Attendances by session
export const getSessionAttendances = async (sessionId, params = {}) => {
  const { data } = await api.get(`${ATT_PREFIX}/session/${sessionId}`, { params });
  return data;
};

// Class statistics
export const getClassStats = async (classId) => {
  const { data } = await api.get(`${ATT_PREFIX}/statistics/class/${classId}`);
  return data;
};

// Class attendance data (detail view)
export const getClassAttendanceData = async (classId) => {
  const { data } = await api.get(`${ATT_PREFIX}/class/${classId}/attendance-data`);
  return data;
};

// Record manual attendance
export const recordManual = async (payload) => {
  const { data } = await api.post(`${ATT_PREFIX}/record`, payload);
  return data;
};

// Record smart (from edge device)
export const recordSmart = async (payload) => {
  const { data } = await api.post(`${ATT_PREFIX}/record/smart`, payload);
  return data;
};

// Update attendance status (lecturer only)
export const updateAttendanceStatus = async (attendanceId, payload) => {
  const { data } = await api.patch(`${ATT_PREFIX}/records/${attendanceId}`, payload);
  return data;
};

// Session management
export const createSession = async (payload) => {
  const { data } = await api.post(`${ATT_PREFIX}/sessions`, payload);
  return data;
};

export const startSession = async (sessionId) => {
  const { data } = await api.patch(`${ATT_PREFIX}/sessions/${sessionId}/start`);
  return data;
};

export const endSession = async (sessionId) => {
  const { data } = await api.patch(`${ATT_PREFIX}/sessions/${sessionId}/end`);
  return data;
};

export default {
  getTodayAttendances,
  getSessionsByClass,
  getSessionAttendances,
  getClassStats,
  getClassAttendanceData,
  recordManual,
  recordSmart,
  updateAttendanceStatus,
  createSession,
  startSession,
  endSession,
};

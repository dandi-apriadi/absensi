import axios from 'axios';

// Gunakan variabel env resmi dari .env: REACT_APP_API_BASE_URL
const BASE_API = process.env.REACT_APP_API_BASE_URL || (typeof window !== 'undefined' && window._env_?.REACT_APP_API_BASE_URL) || '';
const ADMIN_PREFIX = '/api/admin';

const api = axios.create({
  baseURL: BASE_API,
  withCredentials: true
});

export const fetchUsers = async ({ page = 1, limit = 10, search = '', role = '', status = '', sortBy = 'created_at', sortOrder = 'DESC' }) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (search) params.append('search', search);
  if (role && role !== 'all') params.append('role', role);
  if (status && status !== 'all') params.append('status', status);
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

  const { data } = await api.get(`${ADMIN_PREFIX}/users?${params.toString()}`);
  return data.data; // { users, pagination }
};

export const getUser = async (id) => {
  const { data } = await api.get(`${ADMIN_PREFIX}/users/${id}`);
  return data.data.user;
};

export const createUser = async (payload) => {
  const { data } = await api.post(`${ADMIN_PREFIX}/users`, payload);
  return data.data.user;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.put(`${ADMIN_PREFIX}/users/${id}`, payload);
  return data.data.user;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`${ADMIN_PREFIX}/users/${id}`);
  return data;
};

export const updateUserStatus = async (id, status) => {
  const { data } = await api.patch(`${ADMIN_PREFIX}/users/${id}/status`, { status });
  return data.data.user;
};

export const bulkUpdateStatus = async (userIds, status) => {
  const { data } = await api.patch(`${ADMIN_PREFIX}/users/status/bulk`, { userIds, status });
  return data.data;
};

export const fetchDashboard = async () => {
  const { data } = await api.get(`${ADMIN_PREFIX}/dashboard`);
  // Struktur: { success: true, data: { overview: {...}, usersByRole: [...] } }
  return data.data;
};

export default {
  fetchUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  bulkUpdateStatus,
  fetchDashboard
};

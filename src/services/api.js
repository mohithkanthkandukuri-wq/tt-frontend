import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on a protected endpoint, clear stale token
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};

// Item endpoints
export const itemsApi = {
  getItems: (params) => api.get('/items', { params }),
  getRecentItems: () => api.get('/items/recent'),
  getItemById: (id) => api.get(`/items/${id}`),
  createItem: (data) => api.post('/items', data),
  updateItem: (id, data) => api.put(`/items/${id}`, data),
  deleteItem: (id) => api.delete(`/items/${id}`),
  getMyItems: (params) => api.get('/items/my', { params }),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/items/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (id) => api.delete(`/items/${id}/images`),
  markReturned: (id) => api.patch(`/items/${id}/return`),
};

// Claim endpoints
export const claimsApi = {
  createClaim: (itemId, data) => api.post(`/items/${itemId}/claims`, data),
  getMyClaims: (params) => api.get('/claims/my', { params }),
  getClaimById: (id) => api.get(`/claims/${id}`),
  getItemClaims: (itemId) => api.get(`/items/${itemId}/claims`),
  approveClaim: (id, data) => api.patch(`/claims/${id}/approve`, data),
  rejectClaim: (id, data) => api.patch(`/claims/${id}/reject`, data),
  cancelClaim: (id) => api.patch(`/claims/${id}/cancel`),
};

// Notification endpoints
export const notificationsApi = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getRecent: () => api.get('/notifications/recent'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
};

// Admin endpoints
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getItems: (params) => api.get('/admin/items', { params }),
  deleteItem: (id) => api.delete(`/admin/items/${id}`),
  getClaims: (params) => api.get('/admin/claims', { params }),
  deleteClaim: (id) => api.delete(`/admin/claims/${id}`),
};

export default api;

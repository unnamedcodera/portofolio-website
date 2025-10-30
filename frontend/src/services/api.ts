const API_BASE_URL = 'http://localhost:5001/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('admin_token');

// CSRF token cache
let csrfToken: string | null = null;

// Logout callback - set this from the app
let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Get CSRF token
const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  
  try {
    const response = await fetch(`${API_BASE_URL}/csrf-token`);
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken!;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw new Error('Security token unavailable');
  }
};

// API helper function with token expiration and CSRF handling
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Add CSRF token for non-GET requests
  if (options.method && options.method !== 'GET') {
    const csrf = await getCsrfToken();
    defaultHeaders['X-CSRF-Token'] = csrf;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized (token expired or invalid)
  if (response.status === 401) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('adminActiveTab');
    if (logoutCallback) {
      logoutCallback();
    }
    throw new Error('Session expired. Please login again.');
  }

  // Handle 403 Forbidden (CSRF token invalid)
  if (response.status === 403) {
    csrfToken = null; // Reset CSRF token
    const error = await response.json().catch(() => ({ error: 'Request forbidden' }));
    if (error.error?.includes('CSRF')) {
      // Retry once with new CSRF token
      return apiCall(endpoint, options);
    }
    throw new Error(error.error || 'Request forbidden');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Authentication
export const authAPI = {
  login: (username: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  verify: () => apiCall('/auth/verify'),
};

// Team Members
export const teamAPI = {
  getAll: () => apiCall('/team'),
  getById: (id: number) => apiCall(`/team/${id}`),
  create: (data: any) => apiCall('/team', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/team/${id}`, {
    method: 'DELETE',
  }),
};

// Projects
export const projectsAPI = {
  getAll: () => apiCall('/projects'),
  getById: (id: number | string) => apiCall(`/projects/${id}`),
  create: (data: any) => apiCall('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Banner Slides
export const slidesAPI = {
  getAll: () => apiCall('/slides'),
  getById: (id: number) => apiCall(`/slides/${id}`),
  create: (data: any) => apiCall('/slides', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/slides/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/slides/${id}`, {
    method: 'DELETE',
  }),
};

// Categories
export const categoriesAPI = {
  getAll: () => apiCall('/categories'),
  getById: (id: number) => apiCall(`/categories/${id}`),
  create: (data: any) => apiCall('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// File Upload
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};

// Inquiries
export const inquiriesAPI = {
  getAll: () => apiCall('/inquiries'),
  getStats: () => apiCall('/inquiries/stats'),
  getByStatus: (status: string) => apiCall(`/inquiries/status/${status}`),
  getById: (id: number) => apiCall(`/inquiries/${id}`),
  create: (data: any) => apiCall('/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateStatus: (id: number, status: string, notes?: string) => apiCall(`/inquiries/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  }),
  delete: (id: number) => apiCall(`/inquiries/${id}`, {
    method: 'DELETE',
  }),
};

// Settings
export const settingsAPI = {
  get: () => apiCall('/settings'),
  update: (data: any) => apiCall('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export default {
  auth: authAPI,
  team: teamAPI,
  projects: projectsAPI,
  slides: slidesAPI,
  categories: categoriesAPI,
  upload: uploadAPI,
  inquiries: inquiriesAPI,
  settings: settingsAPI,
};

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tactivo-server-1.onrender.com/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.data && response.data.error === false) {
      return response.data.data;
    }
    // If shape is not wrapped, just return data
    if (response.data && response.data.error === undefined) {
      return response.data;
    }
    // Handle API-level errors
    throw new Error(response.data.message || 'API Error');
  },
  (error) => {
    // Handle HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('employee');
        // In Electron/SPA this is fine
        window.location.href = '/';
      }

      throw new Error(data?.message || `HTTP ${status}: ${error.message}`);
    }

    // Network errors
    if (error.request) {
      throw new Error('Network error: Could not connect to server');
    }

    throw error;
  }
);

export default apiClient;

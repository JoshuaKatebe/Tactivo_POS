import apiClient from './client';

export const authApi = {
  /**
   * Login user against Tactivo Server
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{token: string, user: object, employee: object|null}>}
   */
  login: async (username, password) => {
    const data = await apiClient.post('/auth/login', {
      username,
      password,
    });
    // data is already unwrapped by client interceptor
    return data;
  },

  /**
   * Get current user info ("/auth/me")
   * @returns {Promise<object>}
   */
  getMe: async () => {
    return await apiClient.get('/auth/me');
  },

  /**
   * Client-side logout helper
   */
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('employee');
  },
};
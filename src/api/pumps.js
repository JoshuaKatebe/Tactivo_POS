import apiClient from './client';

export const pumpsApi = {
  // Get all pumps (configuration from database)
  getAll: async (filters = {}) => {
    return await apiClient.get('/pumps', { params: filters });
  },

  // Get pump by ID
  getById: async (id) => {
    return await apiClient.get(`/pumps/${id}`);
  },

  // Create pump
  create: async (data) => {
    return await apiClient.post('/pumps', data);
  },

  // Update pump
  update: async (id, data) => {
    return await apiClient.put(`/pumps/${id}`, data);
  },

  // Delete pump
  delete: async (id) => {
    return await apiClient.delete(`/pumps/${id}`);
  },
};


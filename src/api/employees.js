import apiClient from './client';

export const employeesApi = {
  getAll: async (filters = {}) => {
    return await apiClient.get('/employees', { params: filters });
  },

  getById: async (id) => {
    return await apiClient.get(`/employees/${id}`);
  },

  create: async (data) => {
    return await apiClient.post('/employees', data);
  },

  update: async (id, data) => {
    return await apiClient.put(`/employees/${id}`, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`/employees/${id}`);
  },
};
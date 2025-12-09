import apiClient from './client';

export const stationsApi = {
  getAll: async (companyId = null) => {
    const params = companyId ? { company_id: companyId } : {};
    return await apiClient.get('/stations', { params });
  },

  getById: async (id) => {
    return await apiClient.get(`/stations/${id}`);
  },

  create: async (data) => {
    return await apiClient.post('/stations', data);
  },

  update: async (id, data) => {
    return await apiClient.put(`/stations/${id}`, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`/stations/${id}`);
  },
};
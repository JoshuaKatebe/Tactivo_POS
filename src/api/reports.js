import apiClient from './client';

export const reportsApi = {
  getSalesReport: async (filters) => {
    return await apiClient.get('/reports/sales', { params: filters });
  },

  getFuelReport: async (filters) => {
    return await apiClient.get('/reports/fuel', { params: filters });
  },

  getInventoryReport: async (filters) => {
    return await apiClient.get('/reports/inventory', { params: filters });
  },

  getFinancialReport: async (filters) => {
    return await apiClient.get('/reports/financial', { params: filters });
  },

  getEmployeeReport: async (filters) => {
    return await apiClient.get('/reports/employee', { params: filters });
  },

  getPumpReadingsReport: async (filters) => {
    return await apiClient.get('/reports/pump-readings', { params: filters });
  },

  getCreditSalesReport: async (filters) => {
    return await apiClient.get('/reports/credit-sales', { params: filters });
  },
};
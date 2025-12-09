import apiClient from './client';

export const shopApi = {
  // Products
  getProducts: async (filters = {}) => {
    return await apiClient.get('/shop/products', { params: filters });
  },

  getProduct: async (id) => {
    return await apiClient.get(`/shop/products/${id}`);
  },

  createProduct: async (product) => {
    return await apiClient.post('/shop/products', product);
  },

  updateProduct: async (id, product) => {
    return await apiClient.put(`/shop/products/${id}`, product);
  },

  deleteProduct: async (id) => {
    return await apiClient.delete(`/shop/products/${id}`);
  },

  // Sales
  getSales: async (filters = {}) => {
    return await apiClient.get('/shop/sales', { params: filters });
  },

  getSale: async (id) => {
    return await apiClient.get(`/shop/sales/${id}`);
  },

  createSale: async (sale) => {
    return await apiClient.post('/shop/sales', sale);
  },
};
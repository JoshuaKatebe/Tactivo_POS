import apiClient from './client';

export const stockApi = {
    // Get products with stock levels (optional filters)
    getProducts: async (filters = {}) => {
        return await apiClient.get('/stock/products', { params: filters });
    },

    // Get low stock alerts
    getLowStock: async (station_id, threshold = 10) => {
        return await apiClient.get('/stock/low-stock', {
            params: { station_id, threshold }
        });
    },

    // Stock In (Restock)
    stockIn: async (data) => {
        // data: { station_id, items: [{product_id, quantity}], receipt_number, notes }
        return await apiClient.post('/stock/stock-in', data);
    },

    // Manual Adjustment
    adjustStock: async (data) => {
        // data: { product_id, quantity, reason }
        return await apiClient.post('/stock/adjust', data);
    },

    // Get Stock Movements
    getMovements: async (filters = {}) => {
        // filters: { product_id, station_id, type, start_date, end_date }
        return await apiClient.get('/stock/movements', { params: filters });
    }
};

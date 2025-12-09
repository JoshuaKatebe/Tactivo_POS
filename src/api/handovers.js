import apiClient from './client';

/**
 * Handover API Service
 * Handles fuel transaction handovers from attendants to cashiers
 */
export const handoversApi = {
    /**
     * Get pending handovers with optional filtering
     * @param {Object} filters - Optional filters
     * @param {string} filters.employee_id - Filter by employee ID
     * @param {string} filters.employee_name - Search by employee name (partial match)
     * @param {number} filters.pump_number - Filter by pump number
     * @param {string} filters.station_id - Filter by station ID
     * @param {string} filters.sort_by - Sort by: employee_name, employee_id, pump_number, transaction_count, handover_time
     * @param {number} filters.limit - Max results (default 100)
     * @returns {Promise<Array>} Array of pending handovers
     */
    getPending: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.employee_id) params.append('employee_id', filters.employee_id);
        if (filters.employee_name) params.append('employee_name', filters.employee_name);
        if (filters.pump_number) params.append('pump_number', filters.pump_number);
        if (filters.station_id) params.append('station_id', filters.station_id);
        if (filters.sort_by) params.append('sort_by', filters.sort_by);
        if (filters.limit) params.append('limit', filters.limit);

        const queryString = params.toString();
        const url = `/handovers/pending${queryString ? `?${queryString}` : ''}`;

        return await apiClient.get(url);
    },

    /**
     * Get handover details with all linked transactions
     * @param {string} handoverId - Handover ID
     * @returns {Promise<Object>} Handover with transactions
     */
    getDetails: async (handoverId) => {
        return await apiClient.get(`/handovers/${handoverId}/transactions`);
    },

    /**
     * Clear a handover
     * @param {string} handoverId - Handover ID
     * @param {Object} payload - Clearance data
     * @param {string} payload.cashier_employee_id - Cashier employee ID
     * @param {Object} payload.payment_methods - Payment method breakdown (e.g., { cash: 450, card: 50 })
     * @param {number} payload.amount_cashed - Total amount cashed
     * @param {string} payload.notes - Optional notes
     * @returns {Promise<Object>} Cleared handover data
     */
    clearHandover: async (handoverId, payload) => {
        return await apiClient.post(`/handovers/${handoverId}/clear`, payload);
    },

    /**
     * Get all handovers (for reports/history)
     * @param {Object} filters - Optional filters
     * @param {string} filters.status - Filter by status: pending, cleared, cancelled
     * @param {string} filters.station_id - Filter by station ID
     * @returns {Promise<Array>} Array of handovers
     */
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.status) params.append('status', filters.status);
        if (filters.station_id) params.append('station_id', filters.station_id);

        const queryString = params.toString();
        const url = `/handovers${queryString ? `?${queryString}` : ''}`;

        return await apiClient.get(url);
    },
};

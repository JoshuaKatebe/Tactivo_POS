import apiClient from './client';

export const shiftsApi = {
  // Get all shifts
  getAll: async (filters = {}) => {
    return await apiClient.get('/shifts', { params: filters });
  },

  // Get shift by ID
  getById: async (id) => {
    return await apiClient.get(`/shifts/${id}`);
  },

  // Get open shift for station/employee
  getOpenShift: async (stationId, employeeId) => {
    return await apiClient.get('/shifts/open', {
      params: { station_id: stationId, employee_id: employeeId },
    });
  },

  // Start a new shift
  start: async (data) => {
    return await apiClient.post('/shifts/start', data);
  },

  // End a shift
  end: async (id, data) => {
    return await apiClient.post(`/shifts/${id}/end`, data);
  },

  // Close a shift (alias for consistency with API guide)
  close: async (id, closeData) => {
    return await apiClient.post(`/shifts/${id}/close`, closeData);
  },

  // Update shift
  update: async (id, data) => {
    return await apiClient.put(`/shifts/${id}`, data);
  },

  // Delete shift
  delete: async (id) => {
    return await apiClient.delete(`/shifts/${id}`);
  },

  // Get shift transactions
  getTransactions: async (shiftId) => {
    return await apiClient.get(`/shifts/${shiftId}/transactions`);
  },

  // Get shift reconciliation report
  getReconciliation: async (shiftId) => {
    return await apiClient.get(`/reports/shifts/${shiftId}/reconciliation`);
  },

  /**
   * Check if employee has an active (open) shift
   * @param {number} employeeId - Employee ID
   * @param {number} stationId - Station ID
   * @returns {Promise} Open shift data or null
   */
  checkActive: async (employeeId, stationId) => {
    try {
      return await apiClient.get('/shifts/open', {
        params: { employee_id: employeeId, station_id: stationId },
      });
    } catch (error) {
      // If no open shift found, API might return 404
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Ensure employee has an active shift (check or create)
   * @param {number} employeeId - Employee ID
   * @param {number} stationId - Station ID
   * @param {number} openingCash - Opening cash if creating new shift
   * @returns {Promise} Active shift data
   */
  ensureActive: async (employeeId, stationId, openingCash = 0) => {
    let shift = await shiftsApi.checkActive(employeeId, stationId);

    if (!shift) {
      shift = await shiftsApi.start({
        employee_id: employeeId,
        station_id: stationId,
        opening_cash: openingCash,
      });
    }

    return shift;
  },
};


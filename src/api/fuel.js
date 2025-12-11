import apiClient from './client';

export const fuelApi = {
  // Get all pump statuses
  getPumps: async () => {
    return await apiClient.get('/fuel/pumps');
  },

  // Get single pump status
  getPumpStatus: async (pumpNumber) => {
    return await apiClient.get(`/fuel/pumps/${pumpNumber}`);
  },

  // Authorize pump
  authorizePump: async (pumpNumber, params) => {
    return await apiClient.post(`/fuel/pumps/${pumpNumber}/authorize`, params);
  },

  // Stop pump
  stopPump: async (pumpNumber) => {
    return await apiClient.post(`/fuel/pumps/${pumpNumber}/stop`);
  },

  // Emergency stop pump
  emergencyStop: async (pumpNumber) => {
    return await apiClient.post(`/fuel/pumps/${pumpNumber}/emergency-stop`);
  },

  // Pump totals
  getPumpTotals: async (pumpNumber, nozzleNumber = 1) => {
    return await apiClient.get(`/fuel/pumps/${pumpNumber}/totals`, {
      params: { nozzle: nozzleNumber },
    });
  },

  // Pump prices
  getPumpPrices: async (pumpNumber) => {
    return await apiClient.get(`/fuel/pumps/${pumpNumber}/prices`);
  },

  // Set pump prices
  setPumpPrices: async (pumpNumber, prices) => {
    return await apiClient.post(`/fuel/pumps/${pumpNumber}/prices`, { prices });
  },

  // Close/finalize pump transaction
  closeTransaction: async (pumpNumber, ptsControllerId = null) => {
    return await apiClient.post(`/fuel/pumps/${pumpNumber}/close-transaction`, {
      pts_controller_id: ptsControllerId,
    });
  },

  // Tanks
  getTanks: async () => {
    return await apiClient.get('/fuel/tanks');
  },

  // Fuel Grades
  getFuelGrades: async () => {
    return await apiClient.get('/fuel/config/fuel-grades');
  },
};

// Fuel Transactions API
export const fuelTransactionsApi = {
  // Get all fuel transactions
  getAll: async (filters = {}) => {
    return await apiClient.get('/fuel-transactions', { params: filters });
  },

  // Get transaction by ID
  getById: async (id) => {
    return await apiClient.get(`/fuel-transactions/${id}`);
  },

  // Create transaction
  create: async (data) => {
    return await apiClient.post('/fuel-transactions', data);
  },

  // Register transaction (Manual/Simulator)
  register: async (data) => {
    return await apiClient.post('/fuel-transactions/register', data);
  },

  // Mark transaction as synced
  markSynced: async (id) => {
    return await apiClient.post(`/fuel-transactions/${id}/sync`);
  },

  // Get transaction summary
  getSummary: async (filters) => {
    return await apiClient.get('/fuel-transactions/summary', { params: filters });
  },

  // Get pending uncleared transactions for Quick Clear
  getPending: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.station_id) params.append('station_id', filters.station_id);
    if (filters.employee_id) params.append('employee_id', filters.employee_id);
    if (filters.pump_number) params.append('pump_number', filters.pump_number);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const url = `/fuel-transactions/pending${queryString ? `?${queryString}` : ''}`;

    return await apiClient.get(url);
  },

  // Quick clear a single transaction
  quickClear: async (transactionId, cashierEmployeeId) => {
    return await apiClient.post(`/fuel-transactions/${transactionId}/quick-clear`, {
      cashier_employee_id: cashierEmployeeId,
    });
  },
};

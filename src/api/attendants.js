import apiClient from './client';

/**
 * Attendant API Service
 * Handles attendant login, logout, and management
 */
export const attendantsApi = {
    /**
     * Login attendant by employee code
     * @param {string} employeeCode - Employee code
     * @param {number} stationId - Station ID
     * @returns {Promise} Attendant data with employee and shift info
     */
    loginByCode: async (employeeCode, stationId) => {
        return await apiClient.post('/attendants/login', {
            employee_code: employeeCode,
            station_id: stationId,
        });
    },

    /**
     * Login attendant by employee ID
     * @param {number} employeeId - Employee ID
     * @param {number} stationId - Station ID
     * @returns {Promise} Attendant data
     */
    loginById: async (employeeId, stationId) => {
        // First get employee details to get the code
        const employee = await apiClient.get(`/employees/${employeeId}`);
        return await apiClient.post('/attendants/login', {
            employee_code: employee.employee_code,
            station_id: stationId,
        });
    },

    /**
     * Logout attendant
     * @param {number} attendantId - Attendant ID
     * @returns {Promise}
     */
    logout: async (attendantId) => {
        return await apiClient.post(`/attendants/${attendantId}/logout`);
    },

    /**
     * Get active attendants for a station
     * @param {number} stationId - Station ID
     * @returns {Promise} Array of active attendants
     */
    getActive: async (stationId) => {
        return await apiClient.get(`/attendants?station_id=${stationId}&active=true`);
    },

    /**
     * Get attendant by ID
     * @param {number} attendantId - Attendant ID
     * @returns {Promise} Attendant data
     */
    getById: async (attendantId) => {
        return await apiClient.get(`/attendants/${attendantId}`);
    },
};

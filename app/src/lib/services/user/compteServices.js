import userapi from "../../userapi";
import compteEndpoints from "../../endpoint/user/compte";

/**
 * Service for handling compte (user account) operations
 */
const compteService = {
    /**
     * Get all comptes with pagination
     * @param {number} page - Page number
     * @param {number} perPage - Items per page
     * @returns {Promise} - API response
     */
    getAllComptes: async (page = 1, perPage = 10) => {
        const response = await userapi.get(compteEndpoints.getComptesPage(page, perPage));
        return response.data;
    },
    
    /**
     * Get a specific compte by ID
     * @param {number} id - Compte ID
     * @returns {Promise} - API response
     */
    getCompte: async (id) => {
        const response = await userapi.get(compteEndpoints.getCompte(id));
        return response.data;
    },
    
    /**
     * Create a new compte
     * @param {Object} compteData - Compte data
     * @returns {Promise} - API response
     */
    createCompte: async (compteData) => {
        try {
            const response = await userapi.post(compteEndpoints.createCompte, compteData);
            return response.data;
        } catch (error) {
            console.error('Create compte error:', error.response?.data || error.message);
            throw error;
        }
    },
    
    /**
     * Update a compte
     * @param {number} id - Compte ID
     * @param {Object} compteData - Updated compte data
     * @returns {Promise} - API response
     */
    updateCompte: async (id, compteData) => {
        try {
            const response = await userapi.put(compteEndpoints.updateCompte(id), compteData);
            return response.data;
        } catch (error) {
            console.error('Update compte error:', error.response?.data || error.message);
            throw error;
        }
    },
    
    /**
     * Delete a compte
     * @param {number} id - Compte ID
     * @returns {Promise} - API response
     */
    deleteCompte: async (id) => {
        const response = await userapi.delete(compteEndpoints.deleteCompte(id));
        return response.data;
    },
    
    /**
     * Reset password for a compte
     * @param {number} id - Compte ID
     * @param {Object} passwordData - New password data
     * @returns {Promise} - API response
     */
    resetPassword: async (id, passwordData) => {
        try {
            const response = await userapi.patch(compteEndpoints.resetPassword(id), passwordData);
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error.response?.data || error.message);
            throw error;
        }
    },
    
    /**
     * Update role for a compte
     * @param {number} id - Compte ID
     * @param {Object} roleData - New role data
     * @returns {Promise} - API response
     */
    updateRole: async (id, roleData) => {
        try {
            // Convert single role to roles array format expected by the API
            const data = {
                roles: Array.isArray(roleData.role) ? roleData.role : roleData.role
            };
            
            const response = await userapi.patch(compteEndpoints.updateRole(id), data);
            return response.data;
        } catch (error) {
            console.error('Update role error:', error.response?.data || error.message);
            throw error;
        }
    },
    
    /**
     * Search comptes by query
     * @param {string} query - Search query
     * @returns {Promise} - API response
     */
    searchComptes: async (query) => {
        const response = await userapi.get(compteEndpoints.searchComptes(query));
        return response.data;
    },
    
    /**
     * Filter comptes by role
     * @param {string} role - Role to filter by
     * @returns {Promise} - API response
     */
    filterByRole: async (role) => {
        const response = await userapi.get(compteEndpoints.filterByRole(role));
        return response.data;
    }
};

export default compteService; 
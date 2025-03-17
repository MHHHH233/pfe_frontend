const BASE_URL = '/api/admin/v1/comptes'
const compteEndpoints = {
    // Get all comptes with pagination
    getAllComptes: BASE_URL,
    
    // Create a new compte
    createCompte: BASE_URL,
    
    // Get a specific compte by ID
    getCompte: (id) => `${BASE_URL}/${id}`,
    
    // Update a compte
    updateCompte: (id) => `${BASE_URL}/${id}`,
    
    // Delete a compte
    deleteCompte: (id) => `${BASE_URL}/${id}`,
    
    // Reset password for a compte
    resetPassword: (id) => `${BASE_URL}/${id}/reset-password`,
    
    // Update role for a compte
    updateRole: (id) => `${BASE_URL}/${id}/update-role`,
    
    // Additional helper endpoints
    searchComptes: (query) => `${BASE_URL}?search=${query}`,
    filterByRole: (role) => `${BASE_URL}?role=${role}`,
    
    // Pagination helpers
    getComptesPage: (page, perPage = 10) => 
        `${BASE_URL}?page=${page}&per_page=${perPage}`
};

export default compteEndpoints; 
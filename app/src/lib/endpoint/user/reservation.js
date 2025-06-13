const BASE_URL = '/api/user/v1/reservations'
const reservationEndpoints = {
    // Get all reservations with pagination and filters
    getAllReservations: BASE_URL,
    
    // Create a new reservation
    createReservation: BASE_URL,
    
    // Get a specific reservation by ID
    getReservation: (id) => `${BASE_URL}/${id}`,
    
    // Update a reservation
    updateReservation: (id) => `${BASE_URL}/${id}`,
    
    // Delete a reservation
    deleteReservation: (id) => `${BASE_URL}/${id}`,
    
    // Get upcoming reservations
    getUpcomingReservations: `${BASE_URL}/upcoming`,
    
    // Get reservation history
    getReservationHistory: `${BASE_URL}/history`,
    
    // Cancel a reservation
    cancelReservation: (id) => `${BASE_URL}/${id}/cancel`,
    
    // Get week reservations
    getWeekReservations: (date) => `${BASE_URL}/week?date=${date}`,
    
    // Search reservations
    searchReservations: (query) => `${BASE_URL}?search=${query}`,
    
    // Filter by status
    filterByStatus: (status) => `${BASE_URL}?status=${status}`,
    
    // Filter by date
    filterByDate: (date) => `${BASE_URL}?date=${date}`,
    
    // Filter by terrain
    filterByTerrain: (terrainId) => `${BASE_URL}?terrain_id=${terrainId}`,
    
    // Filter by client
    filterByClient: (clientId) => `${BASE_URL}?client_id=${clientId}`,
    
    // Pagination helpers
    getReservationsPage: (page, perPage = 10) => 
        `${BASE_URL}?page=${page}&per_page=${perPage}`,
    
    // Refresh reservation count
    refreshReservationCount: `/api/refresh-reservation-count`,
};

export default reservationEndpoints; 
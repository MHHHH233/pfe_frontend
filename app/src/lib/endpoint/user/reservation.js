const BASE_URL = '/api/user/v1/reservations'
const reservationEndpoints = {
    // Get all reservations with pagination
    getAllReservations: BASE_URL,
    
    // Create a new reservation
    createReservation: BASE_URL,
    
    // Get a specific reservation by ID
    getReservation: (id) => `${BASE_URL}/${id}`,
    
    // Update a reservation
    updateReservation: (id) => `${BASE_URL}/${id}`,
    
    // Delete a reservation
    deleteReservation: (id) => `${BASE_URL}/${id}`,
    
    
   
    
   
    
    searchReservations: (query) => `${BASE_URL}?search=${query}`,
    filterByStatus: (status) => `${BASE_URL}?status=${status}`,
    
    // Pagination helpers
    getReservationsPage: (page, perPage = 10) => 
        `${BASE_URL}?page=${page}&per_page=${perPage}`
};

export default reservationEndpoints; 
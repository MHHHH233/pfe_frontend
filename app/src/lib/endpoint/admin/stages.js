const stagesEndpoints = {
    getAllStages: (page = 1, perPage = 10) => `/api/admin/v1/stages?page=${page}&paginationSize=${perPage}`,
    getStage: (id) => `/api/admin/v1/stages/${id}`,
    createStage: '/api/admin/v1/stages',
    updateStage: (id) => `/api/admin/v1/stages/${id}`,
    deleteStage: (id) => `/api/admin/v1/stages/${id}`,
    searchStages: (query) => `/api/admin/v1/stages?search=${query}`,
    sortStages: (sortBy, sortOrder) => `/api/admin/v1/stages?sort_by=${sortBy}&sort_order=${sortOrder}`,
};

export default stagesEndpoints; 
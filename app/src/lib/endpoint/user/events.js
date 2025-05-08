const BASE_URL = '/api/user/v1/academie-activites';

const eventsEndpoints = {
  getAllEvents: BASE_URL,
  getEvent: (id) => `${BASE_URL}/${id}`,
  getAllEventsPaginated: (page = 1, size = 10) => `${BASE_URL}?page=${page}&paginationSize=${size}`,
};

export default eventsEndpoints; 
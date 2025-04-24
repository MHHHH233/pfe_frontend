const BASE_URL = '/api/user/v1/tournois';

const tournoiEndpoints = {
  getAllTournois: BASE_URL,
  getTournoi: (id) => `${BASE_URL}/${id}`,
  createTournoi: BASE_URL,
  updateTournoi: (id) => `${BASE_URL}/${id}`,
  deleteTournoi: (id) => `${BASE_URL}/${id}`,
};

export default tournoiEndpoints; 
const BASE_URL = '/api/admin/v1/matches';

const matchesEndpoints = {
  getAllMatches: BASE_URL,
  getMatch: (id) => `${BASE_URL}/${id}`,
  createMatch: BASE_URL,
  updateMatch: (id) => `${BASE_URL}/${id}`,
  deleteMatch: (id) => `${BASE_URL}/${id}`,
};

export default matchesEndpoints; 
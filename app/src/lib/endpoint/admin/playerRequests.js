const BASE_URL = '/api/admin/v1/player-requests';

const playerRequestsEndpoints = {
  getAllPlayerRequests: BASE_URL,
  getPlayerRequest: (id) => `${BASE_URL}/${id}`,
  createPlayerRequest: BASE_URL,
  updatePlayerRequest: (id) => `${BASE_URL}/${id}`,
  deletePlayerRequest: (id) => `${BASE_URL}/${id}`,
  updateRequestStatus: (id) => `${BASE_URL}/${id}/status`,
};

export default playerRequestsEndpoints; 
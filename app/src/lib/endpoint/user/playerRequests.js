const BASE_URL = '/api/user/v1/player-requests';

const playerRequestsEndpoints = {
  getAllPlayerRequests: BASE_URL,
  getPlayerRequest: (id) => `${BASE_URL}/${id}`,
  createPlayerRequest: BASE_URL,
  updatePlayerRequest: (id) => `${BASE_URL}/${id}`,
  deletePlayerRequest: (id) => `${BASE_URL}/${id}`,
  acceptRequest: (id) => `${BASE_URL}/${id}/accept`,
  cancelRequest: (id) => `${BASE_URL}/${id}/cancel`,
  getPlayerRequests: `${BASE_URL}/player`,
};

export default playerRequestsEndpoints; 
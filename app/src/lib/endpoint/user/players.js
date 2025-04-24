const BASE_URL = '/api/user/v1/players';

const playersEndpoints = {
  getAllPlayers: BASE_URL,
  getPlayer: (id) => `${BASE_URL}/${id}`,
  createPlayer: BASE_URL,
  updatePlayer: (id) => `${BASE_URL}/${id}`,
  deletePlayer: (id) => `${BASE_URL}/${id}`,
};

export default playersEndpoints; 
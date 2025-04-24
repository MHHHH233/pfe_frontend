const BASE_URL = '/api/user/v1/tournoi-teams';

const tournoiTeamsEndpoints = {
  getAllTeams: BASE_URL,
  getTeam: (id) => `${BASE_URL}/${id}`,
  createTeam: BASE_URL,
  updateTeam: (id) => `${BASE_URL}/${id}`,
  deleteTeam: (id) => `${BASE_URL}/${id}`,
  register: `${BASE_URL}/register`,
  withdraw: (id_tournoi, id_teams) => `${BASE_URL}/withdraw/${id_tournoi}/${id_teams}`,
  getStats: (id_tournoi, id_teams) => `${BASE_URL}/stats/${id_tournoi}/${id_teams}`,
  getUserRegisteredTournaments: `${BASE_URL}/user-registered`,
};

export default tournoiTeamsEndpoints; 
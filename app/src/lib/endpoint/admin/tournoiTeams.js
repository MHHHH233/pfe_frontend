const BASE_URL = '/api/admin/v1/tournoi-teams';

const tournoiTeamsEndpoints = {
  getAllTeams: BASE_URL,
  getTeam: (id) => `${BASE_URL}/${id}`,
  createTeam: BASE_URL,
  updateTeam: (id) => `${BASE_URL}/${id}`,
  deleteTeam: (id) => `${BASE_URL}/${id}`,
};

export default tournoiTeamsEndpoints; 
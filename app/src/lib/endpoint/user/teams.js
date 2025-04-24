const BASE_URL = '/api/user/v1/teams';

const teamsEndpoints = {
  getAllTeams: BASE_URL,
  getTeam: (id) => `${BASE_URL}/${id}`,
  createTeam: BASE_URL,
  updateTeam: (id) => `${BASE_URL}/${id}`,
  deleteTeam: (id) => `${BASE_URL}/${id}`,
  getUserTeams: `${BASE_URL}/user-teams`,
  joinTeam: `${BASE_URL}/join`,
  leaveTeam: `${BASE_URL}/leave`,
  getTeamMembers: (id) => `${BASE_URL}/${id}/members`,
};

export default teamsEndpoints; 
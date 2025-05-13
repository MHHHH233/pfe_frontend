const BASE_URL = '/api/user/v1/teams';

const teamsEndpoints = {
  getAllTeams: BASE_URL,
  getTeam: (id) => `${BASE_URL}/${id}`,
  createTeam: BASE_URL,
  myTeam: `${BASE_URL}/my-team`,
  updateTeam: (id) => `${BASE_URL}/${id}`,
  deleteTeam: (id) => `${BASE_URL}/${id}`,
  getUserTeams: `${BASE_URL}?my_teams=true`,
  joinTeam: (id) => `${BASE_URL}/join/${id}`,
  leaveTeam: (id) => `${BASE_URL}/leave/${id}`,
  getTeamMembers: (id) => `${BASE_URL}/${id}/members`,
  addTeamMember: (id) => `${BASE_URL}/${id}/members`,
  removeTeamMember: (id) => `${BASE_URL}/${id}/members`,
  transferCaptaincy: (id) => `${BASE_URL}/${id}/transfer-captaincy`,
};

export default teamsEndpoints; 
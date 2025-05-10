const BASE_URL = '/api/user/v1/player-teams';

const playerTeamsEndpoints = {
  getAllPlayerTeams: BASE_URL,
  getPlayerTeam: (id) => `${BASE_URL}/${id}`,
  createPlayerTeam: BASE_URL,
  updatePlayerTeam: (id) => `${BASE_URL}/${id}`,
  deletePlayerTeam: (id) => `${BASE_URL}/${id}`,
  joinTeam: (id) => `${BASE_URL}/${id}`,
  leaveTeam: (id) => `${BASE_URL}/${id}`,
  getTeamMembers: (id) => `${BASE_URL}/${id}/members`,
  inviteMember: (id) => `${BASE_URL}/${id}/invite`,
  acceptInvitation: (id) => `${BASE_URL}/${id}/accept`,
  refuseInvitation: (id) => `${BASE_URL}/${id}/refuse`,
  processJoinRequest: (id) => `${BASE_URL}/${id}/process`,
  getPendingInvitations: '/api/user/v1/pending-invitations',
  getPendingJoinRequests: '/api/user/v1/pending-join-requests',
};

export default playerTeamsEndpoints; 
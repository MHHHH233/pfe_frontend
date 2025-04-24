const BASE_URL = '/api/user/v1/matches';

const matchesEndpoints = {
  getAllMatches: BASE_URL,
  getMatch: (id) => `${BASE_URL}/${id}`,
  createMatch: BASE_URL,
  updateMatch: (id) => `${BASE_URL}/${id}`,
  deleteMatch: (id) => `${BASE_URL}/${id}`,
  getTournamentMatches: (tournamentId) => `${BASE_URL}/tournament/${tournamentId}`,
  getTeamMatches: (teamId) => `${BASE_URL}/team/${teamId}`,
  getUpcomingMatches: `${BASE_URL}/upcoming`,
  getCompletedMatches: `${BASE_URL}/completed`,
};

export default matchesEndpoints; 
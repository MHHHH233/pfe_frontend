const BASE_URL = '/api/user/v1/activites-members';

const activitiesMembersEndpoints = {
  getAllMembers: BASE_URL,
  createMember: BASE_URL,
  deleteMember: (id) => `${BASE_URL}/${id}`,
  getActivitesIn: (id) => `${BASE_URL}/member-activites/${id}`,
};

export default activitiesMembersEndpoints; 
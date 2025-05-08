const BASE_URL = '/api/user/v1/activites-members';

const activitiesMembersEndpoints = {
  getAllMembers: BASE_URL,
  createMember: BASE_URL,
  deleteMember: (id) => `${BASE_URL}/${id}`,
};

export default activitiesMembersEndpoints; 
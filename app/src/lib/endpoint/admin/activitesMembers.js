const BASE_URL = '/api/admin/v1/activites-members';

const activitesMembersEndpoints = {
  getAllMembers: BASE_URL,
  getMember: (id) => `${BASE_URL}/${id}`,
  createMember: BASE_URL,
  updateMember: (id) => `${BASE_URL}/${id}`,
  deleteMember: (id) => `${BASE_URL}/${id}`,
};

export default activitesMembersEndpoints; 
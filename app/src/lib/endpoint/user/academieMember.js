const BASE_URL = '/api/user/v1';

const academieMemberEndpoints = {
  subscribe: `${BASE_URL}/academie-subscribe`,
  cancelSubscription: (academieId) => `${BASE_URL}/academie-subscribe/${academieId}`,
  getMyMemberships: `${BASE_URL}/my-academie-memberships`,
  updatePlan: (academieId) => `${BASE_URL}/academie-subscribe/${academieId}/plan`,
};

export default academieMemberEndpoints; 
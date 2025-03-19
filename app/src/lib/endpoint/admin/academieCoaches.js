const BASE_URL = '/api/admin/v1/academie-coaches';

const academieCoachesEndpoints = {
  getAllCoaches: BASE_URL,
  getCoach: (id) => `${BASE_URL}/${id}`,
  createCoach: BASE_URL,
  updateCoach: (id) => `${BASE_URL}/${id}`,
  deleteCoach: (id) => `${BASE_URL}/${id}`,
};

export default academieCoachesEndpoints; 
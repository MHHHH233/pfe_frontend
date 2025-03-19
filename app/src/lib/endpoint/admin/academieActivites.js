const BASE_URL = '/api/admin/v1/academie-activites';

const academieActivitesEndpoints = {
  getAllActivites: BASE_URL,
  getActivite: (id) => `${BASE_URL}/${id}`,
  createActivite: BASE_URL,
  updateActivite: (id) => `${BASE_URL}/${id}`,
  deleteActivite: (id) => `${BASE_URL}/${id}`,
};

export default academieActivitesEndpoints; 
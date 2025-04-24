const BASE_URL = '/api/user/v1/academie-programmes';

const academieProgrammesEndpoints = {
  getAllProgrammes: BASE_URL,
  getProgramme: (id) => `${BASE_URL}/${id}`,
  // createProgramme: BASE_URL,
  // updateProgramme: (id) => `${BASE_URL}/${id}`,
  // deleteProgramme: (id) => `${BASE_URL}/${id}`,
};

export default academieProgrammesEndpoints; 
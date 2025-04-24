const BASE_URL = '/api/user/v1/academie';
const academieEndpoints = {
    getAllAcademies: BASE_URL,
    getAcademie: (id) => `${BASE_URL}/${id}`,
    // createAcademie: BASE_URL,
    // updateAcademie: (id) => `${BASE_URL}/${id}`,
    // deleteAcademie: (id) => `${BASE_URL}/${id}`,
  };
  
  export default academieEndpoints; 
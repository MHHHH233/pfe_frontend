const BASE_URL = '/api/admin/v1/ratings';

const ratingsEndpoints = {
  getAllRatings: BASE_URL,
  getRating: (id) => `${BASE_URL}/${id}`,
  createRating: BASE_URL,
  updateRating: (id) => `${BASE_URL}/${id}`,
  deleteRating: (id) => `${BASE_URL}/${id}`,
};

export default ratingsEndpoints; 
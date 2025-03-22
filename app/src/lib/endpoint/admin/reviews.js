const BASE_URL = '/api/admin/v1/reviews';

const reviewsEndpoints = {
  getAllReviews: BASE_URL,
  getReview: (id) => `${BASE_URL}/${id}`,
  createReview: BASE_URL,
  updateReview: (id) => `${BASE_URL}/${id}`,
  updateStatus: (id) => `${BASE_URL}/${id}/status`,
  deleteReview: (id) => `${BASE_URL}/${id}`,
};

export default reviewsEndpoints; 
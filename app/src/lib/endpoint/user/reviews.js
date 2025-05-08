const BASE_URL = '/api/user/v1/reviews';

const reviewsEndpoints = {
  getAllReviews: BASE_URL,
  createReview: BASE_URL,
  deleteReview: (id) => `${BASE_URL}/${id}`,
};

export default reviewsEndpoints;

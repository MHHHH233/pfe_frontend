import reviewsEndpoints from '../../endpoint/user/reviews';
import apiGuest from '../../userapi';

const reviewsService = {
  async getAllReviews() {
    try {
      const response = await apiGuest.get(reviewsEndpoints.getAllReviews);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  async createReview(formData) {
    try {
      const response = await apiGuest.post(reviewsEndpoints.createReview, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  async deleteReview(id) {
    try {
      const response = await apiGuest.delete(reviewsEndpoints.deleteReview(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
      throw error;
    }
  }
};

export default reviewsService; 
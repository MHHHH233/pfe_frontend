import reviewsEndpoints from '../../endpoint/admin/reviews';
import apiClient from '../../userapi';

const reviewsService = {
  async getAllReviews(params = {}) {
    try {
      const response = await apiClient.get(reviewsEndpoints.getAllReviews, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  async getReview(id) {
    try {
      const response = await apiClient.get(reviewsEndpoints.getReview(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      throw error;
    }
  },

  async createReview(formData) {
    try {
      const response = await apiClient.post(reviewsEndpoints.createReview, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  async updateReview(id, payload) {
    try {
      const response = await apiClient.put(reviewsEndpoints.updateReview(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating review ${id}:`, error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const response = await apiClient.patch(reviewsEndpoints.updateStatus(id), { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating review status ${id}:`, error);
      throw error;
    }
  },

  async deleteReview(id) {
    try {
      const response = await apiClient.delete(reviewsEndpoints.deleteReview(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
      throw error;
    }
  }
};

export default reviewsService; 
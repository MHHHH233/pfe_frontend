import ratingsEndpoints from '../../endpoint/admin/ratings';
import apiClient from '../../userapi';

const ratingsService = {
  async getAllRatings(params = {}) {
    try {
      const response = await apiClient.get(ratingsEndpoints.getAllRatings, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }
  },

  async getRating(id, params = {}) {
    try {
      const response = await apiClient.get(ratingsEndpoints.getRating(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching rating ${id}:`, error);
      throw error;
    }
  },

  async createRating(formData) {
    try {
      const response = await apiClient.post(ratingsEndpoints.createRating, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating rating:', error);
      throw error;
    }
  },

  async updateRating(id, payload) {
    try {
      const response = await apiClient.put(ratingsEndpoints.updateRating(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating rating ${id}:`, error);
      throw error;
    }
  },

  async deleteRating(id) {
    try {
      const response = await apiClient.delete(ratingsEndpoints.deleteRating(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting rating ${id}:`, error);
      throw error;
    }
  }
};

export default ratingsService; 
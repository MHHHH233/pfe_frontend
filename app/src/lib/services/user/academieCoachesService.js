import academieCoachesEndpoints from '../../endpoint/user/academieCoaches';
import apiClient from '../../userapi';

const academieCoachesService = {
  async getAllCoaches(params = {}) {
    try {
      const response = await apiClient.get(academieCoachesEndpoints.getAllCoaches, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching coaches:', error);
      throw error;
    }
  },

  async getCoach(id) {
    try {
      const response = await apiClient.get(academieCoachesEndpoints.getCoach(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching coach ${id}:`, error);
      throw error;
    }
  },

  async createCoach(formData) {
    try {
      const response = await apiClient.post(academieCoachesEndpoints.createCoach, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating coach:', error);
      throw error;
    }
  },

  async updateCoach(id, formData) {
    try {
      // Add method spoofing for Laravel
      if (formData instanceof FormData) {
        formData.append('_method', 'PUT');
      }
      const response = await apiClient.post(academieCoachesEndpoints.updateCoach(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating coach:', error);
      throw error;
    }
  },

  async deleteCoach(id) {
    try {
      const response = await apiClient.delete(academieCoachesEndpoints.deleteCoach(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting coach ${id}:`, error);
      throw error;
    }
  }
};

export default academieCoachesService; 
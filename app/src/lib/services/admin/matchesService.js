import matchesEndpoints from '../../endpoint/admin/matches';
import apiClient from '../../userapi';

const matchesService = {
  async getAllMatches(params = {}) {
    try {
      const response = await apiClient.get(matchesEndpoints.getAllMatches, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  async getMatch(id, params = {}) {
    try {
      const response = await apiClient.get(matchesEndpoints.getMatch(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching match ${id}:`, error);
      throw error;
    }
  },

  async createMatch(formData) {
    try {
      const response = await apiClient.post(matchesEndpoints.createMatch, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  },

  async updateMatch(id, payload) {
    try {
      const response = await apiClient.put(matchesEndpoints.updateMatch(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating match ${id}:`, error);
      throw error;
    }
  },

  async deleteMatch(id) {
    try {
      const response = await apiClient.delete(matchesEndpoints.deleteMatch(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting match ${id}:`, error);
      throw error;
    }
  }
};

export default matchesService; 
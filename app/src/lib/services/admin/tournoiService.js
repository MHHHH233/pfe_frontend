import tournoiEndpoints from '../../endpoint/admin/tournoi';
import apiClient from '../../userapi';

const tournoiService = {
  async getAllTournois(params = {}) {
    try {
      const response = await apiClient.get(tournoiEndpoints.getAllTournois, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  },

  async getTournoi(id, params = {}) {
    try {
      const response = await apiClient.get(tournoiEndpoints.getTournoi(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching tournament ${id}:`, error);
      throw error;
    }
  },

  async createTournoi(formData) {
    try {
      const response = await apiClient.post(tournoiEndpoints.createTournoi, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  },

  async updateTournoi(id, payload) {
    try {
      const response = await apiClient.put(tournoiEndpoints.updateTournoi(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating tournament ${id}:`, error);
      throw error;
    }
  },

  async deleteTournoi(id) {
    try {
      const response = await apiClient.delete(tournoiEndpoints.deleteTournoi(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting tournament ${id}:`, error);
      throw error;
    }
  }
};

export default tournoiService; 
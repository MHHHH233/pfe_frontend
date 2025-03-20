import tournoiTeamsEndpoints from '../../endpoint/admin/tournoiTeams';
import apiClient from '../../userapi';

const tournoiTeamsService = {
  async getAllTeams(params = {}) {
    try {
      const response = await apiClient.get(tournoiTeamsEndpoints.getAllTeams, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  async getTeam(id, params = {}) {
    try {
      const response = await apiClient.get(tournoiTeamsEndpoints.getTeam(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${id}:`, error);
      throw error;
    }
  },

  async createTeam(formData) {
    try {
      const response = await apiClient.post(tournoiTeamsEndpoints.createTeam, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },

  async updateTeam(id, payload) {
    try {
      const response = await apiClient.put(tournoiTeamsEndpoints.updateTeam(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating team ${id}:`, error);
      throw error;
    }
  },

  async deleteTeam(id) {
    try {
      const response = await apiClient.delete(tournoiTeamsEndpoints.deleteTeam(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting team ${id}:`, error);
      throw error;
    }
  }
};

export default tournoiTeamsService; 
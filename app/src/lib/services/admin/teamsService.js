import teamsEndpoints from '../../endpoint/admin/teams';
import apiClient from '../../userapi';

const teamsService = {
  async getAllTeams(params = {}) {
    try {
      const response = await apiClient.get(teamsEndpoints.getAllTeams, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  async getTeam(id, params = {}) {
    try {
      const response = await apiClient.get(teamsEndpoints.getTeam(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${id}:`, error);
      throw error;
    }
  },

  async createTeam(formData) {
    try {
      const response = await apiClient.post(teamsEndpoints.createTeam, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },

  async updateTeam(id, payload) {
    try {
      const response = await apiClient.put(teamsEndpoints.updateTeam(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating team ${id}:`, error);
      throw error;
    }
  },

  async deleteTeam(id) {
    try {
      const response = await apiClient.delete(teamsEndpoints.deleteTeam(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting team ${id}:`, error);
      throw error;
    }
  }
};

export default teamsService; 
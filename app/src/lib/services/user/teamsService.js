import teamsEndpoints from '../../endpoint/user/teams';
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
  },

  async getUserTeams(params = {}) {
    try {
      const response = await apiClient.get(teamsEndpoints.getUserTeams, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user teams:', error);
      throw error;
    }
  },
  
  async joinTeam(formData) {
    try {
      const response = await apiClient.post(teamsEndpoints.joinTeam, formData);
      return response.data;
    } catch (error) {
      console.error('Error joining team:', error);
      throw error;
    }
  },
  
  async leaveTeam(formData) {
    try {
      const response = await apiClient.post(teamsEndpoints.leaveTeam, formData);
      return response.data;
    } catch (error) {
      console.error('Error leaving team:', error);
      throw error;
    }
  },
  
  async getTeamMembers(teamId, params = {}) {
    try {
      const response = await apiClient.get(teamsEndpoints.getTeamMembers(teamId), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching team members for team ${teamId}:`, error);
      throw error;
    }
  }
};

export default teamsService; 
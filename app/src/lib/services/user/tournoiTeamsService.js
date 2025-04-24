import tournoiTeamsEndpoints from '../../endpoint/user/tournoiTeams';
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
  },
  
  async registerForTournament(payload) {
    try {
      const response = await apiClient.post(tournoiTeamsEndpoints.register, payload);
      return response.data;
    } catch (error) {
      console.error('Error registering for tournament:', error);
      throw error;
    }
  },
  
  async withdrawFromTournament(id_tournoi, id_teams) {
    try {
      const response = await apiClient.delete(tournoiTeamsEndpoints.withdraw(id_tournoi, id_teams));
      return response.data;
    } catch (error) {
      console.error('Error withdrawing from tournament:', error);
      throw error;
    }
  },
  
  async getTeamStats(id_tournoi, id_teams) {
    try {
      const response = await apiClient.get(tournoiTeamsEndpoints.getStats(id_tournoi, id_teams));
      return response.data;
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  },

  async getUserRegisteredTournaments() {
    try {
      const response = await apiClient.get(tournoiTeamsEndpoints.getUserRegisteredTournaments);
      return response.data;
    } catch (error) {
      console.error('Error fetching user registered tournaments:', error);
      throw error;
    }
  }
};

export default tournoiTeamsService; 
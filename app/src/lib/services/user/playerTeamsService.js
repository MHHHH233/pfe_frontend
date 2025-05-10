import playerTeamsEndpoints from '../../endpoint/user/playerTeams';
import apiClient from '../../userapi';

const playerTeamsService = {
  async getAllPlayerTeams(params = {}) {
    try {
      const response = await apiClient.get(playerTeamsEndpoints.getAllPlayerTeams, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching player teams:', error);
      throw error;
    }
  },

  async getPlayerTeam(id, params = {}) {
    try {
      if (!id) {
        throw new Error('Team ID is required');
      }
      const response = await apiClient.get(playerTeamsEndpoints.getPlayerTeam(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching player team ${id}:`, error);
      throw error;
    }
  },

  async createPlayerTeam(formData) {
    try {
      const response = await apiClient.post(playerTeamsEndpoints.createPlayerTeam, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating player team:', error);
      throw error;
    }
  },

  async updatePlayerTeam(id, payload) {
    try {
      if (!id) {
        throw new Error('Team ID is required');
      }
      const response = await apiClient.put(playerTeamsEndpoints.updatePlayerTeam(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating player team ${id}:`, error);
      throw error;
    }
  },

  async deletePlayerTeam(id) {
    try {
      if (!id) {
        throw new Error('Team ID is required');
      }
      const response = await apiClient.delete(playerTeamsEndpoints.deletePlayerTeam(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting player team ${id}:`, error);
      throw error;
    }
  },

  async joinTeam(id) {
    try {
      if (!id) {
        throw new Error('Team ID is required');
      }
      const response = await apiClient.post(playerTeamsEndpoints.joinTeam(id));
      return response.data;
    } catch (error) {
      console.error(`Error joining team ${id}:`, error);
      throw error;
    }
  },

  async leaveTeam(id) {
    try {
      if (!id) {
        throw new Error('Team ID is required');
      }
      const response = await apiClient.delete(playerTeamsEndpoints.leaveTeam(id));
      return response.data;
    } catch (error) {
      console.error(`Error leaving team ${id}:`, error);
      throw error;
    }
  },

  async getTeamMembers(id, params = {}) {
    try {
      if (!id) {
        throw new Error('Team ID is required');
      }
      const response = await apiClient.get(playerTeamsEndpoints.getTeamMembers(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching team members for team ${id}:`, error);
      throw error;
    }
  },

  async inviteMember(payload) {
   try {
      const response = await apiClient.post(playerTeamsEndpoints.createPlayerTeam(payload));
      return response.data;
    } catch (error) {
      console.error('Error creating player team:', error);
      throw error;
    }
  },

  async acceptInvitation(id) {
    try {
      if (!id) {
        throw new Error('Invitation ID is required');
      }
      const response = await apiClient.post(playerTeamsEndpoints.acceptInvitation(id));
      return response.data;
    } catch (error) {
      console.error(`Error accepting invitation ${id}:`, error);
      throw error;
    }
  },

  async refuseInvitation(id) {
    try {
      if (!id) {
        throw new Error('Invitation ID is required');
      }
      const response = await apiClient.post(playerTeamsEndpoints.refuseInvitation(id));
      return response.data;
    } catch (error) {
      console.error(`Error refusing invitation ${id}:`, error);
      throw error;
    }
  },

  async processJoinRequest(id, payload) {
    try {
      if (!id) {
        throw new Error('Request ID is required');
      }
      const response = await apiClient.post(playerTeamsEndpoints.processJoinRequest(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error processing join request ${id}:`, error);
      throw error;
    }
  },

  async getPendingInvitations(params = {}) {
    try {
      const response = await apiClient.get(playerTeamsEndpoints.getPendingInvitations, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending invitations:', error);
      throw error;
    }
  },

  async getPendingJoinRequests(params = {}) {
    try {
      const response = await apiClient.get(playerTeamsEndpoints.getPendingJoinRequests, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending join requests:', error);
      throw error;
    }
  },

  async addPlayerToTeam(payload) {
    try {
      if (!payload.player_id) {
        throw new Error('Player ID is required');
      }
      if (!payload.team_id) {
        throw new Error('Team ID is required');
      }
      const response = await apiClient.post(playerTeamsEndpoints.createPlayerTeam, payload);
      return response.data;
    } catch (error) {
      console.error(`Error adding player to team:`, error);
      throw error;
    }
  },

  async invitePlayerToTeam(teamId, playerId) {
    try {
      if (!teamId) {
        throw new Error('Team ID is required');
      }
      if (!playerId) {
        throw new Error('Player ID is required');
      }
      
      return await this.addPlayerToTeam({
        player_id: playerId,
        team_id: teamId
      });
    } catch (error) {
      console.error(`Error inviting player ${playerId} to team ${teamId}:`, error);
      throw error;
    }
  },

  async removeTeamMember(teamId, playerId) {
    try {
      if (!teamId) {
        throw new Error('Team ID is required');
      }
      if (!playerId) {
        throw new Error('Player ID is required');
      }
      const response = await apiClient.delete(`${playerTeamsEndpoints.getTeamMembers(teamId)}/${playerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing player ${playerId} from team ${teamId}:`, error);
      throw error;
    }
  }
};

export default playerTeamsService; 
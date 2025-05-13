import teamsEndpoints from '../../endpoint/user/teams';
import apiClient from '../../userapi';

const teamsService = {
  async getAllTeams(params = {}) {
    try {
      // Add default includes if not specified
      if (!params.include) {
        params.include = 'captain,members,ratings';
      }
      const response = await apiClient.get(teamsEndpoints.getAllTeams, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  async getTeam(id, params = {}) {
    try {
      // Add default includes if not specified
      if (!params.include) {
        params.include = 'captain,members,ratings';
      }
      const response = await apiClient.get(teamsEndpoints.getTeam(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${id}:`, error);
      throw error;
    }
  },
  /**
   * Get the current user's team information
   * @param {Object} params - The request parameters
   * @param {string|number} params.player_id - The ID of the player
   * @param {string} [params.include] - Comma-separated list of relations to include
   * @returns {Promise<{
   *   success: boolean,
   *   data: {
   *     team: {
   *       id_teams: number,
   *       team_name: string|null,
   *       capitain: number,
   *       total_matches: number,
   *       rating: number,
   *       members: Array<{
   *         id_player: number,
   *         name: string,
   *         position: string,
   *         rating: number
   *       }>,
   *       captain_details: {
   *         id_compte: number,
   *         name: string,
   *         email: string
   *       },
   *       ratings: Array<any>,
   *       created_at: string,
   *       updated_at: string
   *     },
   *     is_captain: boolean,
   *     members_count: number,
   *     player_id: string
   *   }
   * }>}
   */
  async getMyTeam(params = {}) {
    try {
      // Add default includes if not specified
      if (!params.include) {
        params.include = 'captain,members,ratings';
      }
      
      const response = await apiClient.post(teamsEndpoints.myTeam, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching my team:', error);
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

  // Method for creating a team and adding a player in one step
  async createTeamWithPlayer(teamData, playerId) {
    try {
      // First create the team
      const teamResponse = await this.createTeam(teamData);
      
      if (!teamResponse || !teamResponse.success) {
        throw new Error('Failed to create team');
      }
      
      const teamId = teamResponse.data?.id_teams;
      if (!teamId) {
        throw new Error('Team ID missing from response');
      }
      
      // Now add the player
      const playerData = {
        player_id: playerId,
        team_id: teamId
      };
      
      const playerResponse = await apiClient.post(teamsEndpoints.createTeam, playerData);
      return {
        team: teamResponse.data,
        invitation: playerResponse.data
      };
    } catch (error) {
      console.error('Error creating team with player:', error);
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
      // Add my_teams flag and default includes
      params.my_teams = true;
      if (!params.include) {
        params.include = 'captain,members,ratings';
      }
      const response = await apiClient.get(teamsEndpoints.getAllTeams, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user teams:', error);
      throw error;
    }
  },
  
  async joinTeam(teamId) {
    try {
      const response = await apiClient.post(`${teamsEndpoints.joinTeam}/${teamId}`);
      return response.data;
    } catch (error) {
      console.error('Error joining team:', error);
      throw error;
    }
  },
  
  async leaveTeam(teamId) {
    try {
      const response = await apiClient.post(`${teamsEndpoints.leaveTeam}/${teamId}`);
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
  },
  
  // Method to add player to team (used for invitations)
  async addPlayerToTeam(playerData) {
    try {
      if (!playerData.player_id) {
        throw new Error('Player ID is required');
      }
      if (!playerData.team_id) {
        throw new Error('Team ID is required');
      }
      
      // Use the create team endpoint as per the controller
      const response = await apiClient.post(teamsEndpoints.createTeam, {
        capitain: playerData.player_id,
        team_id: playerData.team_id
      });
      
      return response.data;
    } catch (error) {
      console.error('Error adding player to team:', error);
      throw error;
    }
  },

  // Team management methods for captain privileges
  
  async addTeamMember(teamId, playerId) {
    try {
      if (!teamId) {
        throw new Error('Team ID is required');
      }
      if (!playerId) {
        throw new Error('Player ID is required');
      }
      
      const response = await apiClient.post(teamsEndpoints.addTeamMember(teamId), {
        player_id: playerId
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error adding member to team ${teamId}:`, error);
      throw error;
    }
  },
  
  async removeTeamMember(teamId, playerId, payload) {
    try {
      if (!teamId) {
        throw new Error('Team ID is required');
      }
      if (!playerId) {
        throw new Error('Player ID is required');
      }
      if (!payload?.captain_id) {
        throw new Error('Captain ID is required');
      }
      
      // Use the DELETE method with body
      const response = await apiClient.delete(teamsEndpoints.removeTeamMember(teamId), {
        data: { 
          player_id: playerId,
          captain_id: payload.captain_id
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error removing member from team ${teamId}:`, error);
      throw error;
    }
  },
  
  async transferCaptaincy(teamId, newCaptainId) {
    try {
      if (!teamId) {
        throw new Error('Team ID is required');
      }
      if (!newCaptainId) {
        throw new Error('New captain ID is required');
      }
      
      const response = await apiClient.post(teamsEndpoints.transferCaptaincy(teamId), {
        new_captain_id: newCaptainId
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error transferring captaincy for team ${teamId}:`, error);
      throw error;
    }
  },
};

export default teamsService; 
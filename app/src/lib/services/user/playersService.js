import playersEndpoints from '../../endpoint/user/players';
import apiClient from '../../userapi';

const playersService = {
  async getAllPlayers(params = {}) {
    try {
      const response = await apiClient.get(playersEndpoints.getAllPlayers, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  },

  async getPlayer(id, params = {}) {
    try {
      if (!id) {
        throw new Error('Player ID is required');
      }
      
      const response = await apiClient.get(playersEndpoints.getPlayer(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching player ${id}:`, error);
      throw error;
    }
  },

  async createPlayer(formData) {
    try {
      const response = await apiClient.post(playersEndpoints.createPlayer, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  },

  async updatePlayer(id, payload) {
    try {
      if (!id) {
        throw new Error('Player ID is required');
      }
      
      const response = await apiClient.put(playersEndpoints.updatePlayer(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating player ${id}:`, error);
      throw error;
    }
  },

  async deletePlayer(id) {
    try {
      if (!id) {
        throw new Error('Player ID is required');
      }
      
      const response = await apiClient.delete(playersEndpoints.deletePlayer(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting player ${id}:`, error);
      throw error;
    }
  }
};

export default playersService; 
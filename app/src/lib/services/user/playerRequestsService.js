import playerRequestsEndpoints from '../../endpoint/admin/playerRequests';
import apiClient from '../../userapi';

const playerRequestsService = {
  async getAllPlayerRequests(params = {}) {
    try {
      const response = await apiClient.get(playerRequestsEndpoints.getAllPlayerRequests, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching player requests:', error);
      throw error;
    }
  },

  async getPlayerRequest(id, params = {}) {
    try {
      const response = await apiClient.get(playerRequestsEndpoints.getPlayerRequest(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching player request ${id}:`, error);
      throw error;
    }
  },

  async createPlayerRequest(formData) {
    try {
      const response = await apiClient.post(playerRequestsEndpoints.createPlayerRequest, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating player request:', error);
      throw error;
    }
  },

  async updatePlayerRequest(id, payload) {
    try {
      const response = await apiClient.put(playerRequestsEndpoints.updatePlayerRequest(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating player request ${id}:`, error);
      throw error;
    }
  },

  async deletePlayerRequest(id) {
    try {
      const response = await apiClient.delete(playerRequestsEndpoints.deletePlayerRequest(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting player request ${id}:`, error);
      throw error;
    }
  },

  async updateRequestStatus(id, status) {
    try {
      const response = await apiClient.patch(playerRequestsEndpoints.updateRequestStatus(id), { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating player request status ${id}:`, error);
      throw error;
    }
  },
  
  async getPlayerRequests() {
    try {
      // This should fetch both sent and received requests for the authenticated user
      const response = await apiClient.get(playerRequestsEndpoints.getAllPlayerRequests, { 
        params: { 
          player: true, // Add a parameter to indicate we want the current player's requests
          include: 'sender,receiver' // Optional: Include related data
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching player requests:', error);
      throw error;
    }
  }
};

export default playerRequestsService; 
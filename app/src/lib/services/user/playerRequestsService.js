import playerRequestsEndpoints from '../../endpoint/user/playerRequests';
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
      // Get sender ID from session storage if not provided in formData
      const sender = formData.sender || sessionStorage.getItem('player_id');
      
      if (!sender) {
        throw new Error('Sender ID is required. Make sure you are logged in as a player.');
      }
      
      if (!formData.receiver_id && !formData.receiver) {
        throw new Error('Receiver ID is required');
      }
      
      // Set default request type if not provided
      if (!formData.request_type) {
        formData.request_type = 'match';
      }

      // Format the data according to backend requirements
      const payload = {
        sender: parseInt(sender, 10),
        receiver: parseInt(formData.receiver_id || formData.receiver, 10),
        match_date: formData.match_date,
        starting_time: formData.starting_time,
        message: formData.message || 'Would you like to play a match?',
        request_type: formData.request_type,
        team_id: formData.team_id || null
      };

      const response = await apiClient.post(playerRequestsEndpoints.createPlayerRequest, payload);
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
      if (!id) {
        throw new Error('Request ID is required');
      }
      
      const response = await apiClient.delete(playerRequestsEndpoints.deletePlayerRequest(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting player request ${id}:`, error);
      throw error;
    }
  },

  async acceptRequest(id) {
    try {
      if (!id) {
        throw new Error('Request ID is required');
      }
      
      const response = await apiClient.post(playerRequestsEndpoints.acceptRequest(id));
      return response.data;
    } catch (error) {
      console.error(`Error accepting request ${id}:`, error);
      throw error;
    }
  },

  async cancelRequest(id) {
    try {
      if (!id) {
        throw new Error('Request ID is required');
      }
      
      const response = await apiClient.post(playerRequestsEndpoints.cancelRequest(id));
      return response.data;
    } catch (error) {
      console.error(`Error cancelling request ${id}:`, error);
      throw error;
    }
  },
  
  async getPlayerRequests(params = {}) {
    try {
      // Get player ID from session storage if not provided
      const playerId = params.player_id || sessionStorage.getItem('player_id');
      
      if (!playerId) {
        throw new Error('Player ID not found. Make sure you are logged in as a player.');
      }
      
      // Prepare request parameters
      const requestParams = {
        player_id: playerId,
        ...params
      };
      
      const response = await apiClient.get(playerRequestsEndpoints.getPlayerRequests, { 
        params: requestParams
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching player requests:', error);
      throw error;
    }
  },

  async getSentAndReceivedRequests() {
    try {
      // Get player ID from session storage
      const playerId = sessionStorage.getItem('player_id');
      
      if (!playerId) {
        throw new Error('Player ID not found. Make sure you are logged in as a player.');
      }
      
      // Get all requests for the player
      const response = await this.getPlayerRequests({
        include: 'sender,receiver,sender.compte,receiver.compte'
      });
      
      // Separate into sent and received
      const requests = response.data || [];
      const sent = requests.filter(req => req.sender.toString() === playerId.toString());
      const received = requests.filter(req => req.receiver.toString() === playerId.toString());
      
      return {
        sent,
        received
      };
    } catch (error) {
      console.error('Error fetching sent and received requests:', error);
      throw error;
    }
  },

  // Helper method to format the request data for display
  formatRequestData(request) {
    return {
      id: request.id,
      sender: request.sender,
      receiver: request.receiver,
      matchDate: new Date(request.match_date).toLocaleDateString(),
      startingTime: new Date(request.starting_time).toLocaleTimeString(),
      message: request.message,
      status: request.status,
      type: request.request_type,
      expiresAt: request.expires_at ? new Date(request.expires_at).toLocaleDateString() : null,
      teamId: request.team_id
    };
  }
};

export default playerRequestsService; 
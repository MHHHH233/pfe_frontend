import terrainEndpoints from '../../endpoint/user/terrain';
import apiClient from '../../userapi';

const terrainService = {
  async getAllTerrains(params = {}) {
    try {
      const response = await apiClient.get(terrainEndpoints.getAllTerrains, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching terrains:', error);
      throw error;
    }
  },

  async getTerrain(id) {
    try {
      const response = await apiClient.get(terrainEndpoints.getTerrain(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching terrain ${id}:`, error);
      throw error;
    }
  }
};

export default terrainService; 
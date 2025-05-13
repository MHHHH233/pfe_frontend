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
  },

  // Filter terrains by type (indoor/outdoor)
  async getTerrainsByType(type) {
    try {
      const response = await apiClient.get(terrainEndpoints.getAllTerrains, { 
        params: { type }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching terrains by type ${type}:`, error);
      throw error;
    }
  },

  // Get terrains with price range
  async getTerrainsByPriceRange(minPrice, maxPrice) {
    try {
      const response = await apiClient.get(terrainEndpoints.getAllTerrains, { 
        params: { min_price: minPrice, max_price: maxPrice }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching terrains by price range:`, error);
      throw error;
    }
  },

  // Search terrains by name
  async searchTerrains(query) {
    try {
      const response = await apiClient.get(terrainEndpoints.getAllTerrains, {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching terrains:`, error);
      throw error;
    }
  }
};

export default terrainService; 
import terrainEndpoints from '../../endpoint/admin/terrain';
import apiClient from '../../adminapi';

const terrainService = {
  async getAllTerrains(params = {}) {
    try {
      const response = await apiClient.get(terrainEndpoints.getAllTerrains, { params });
      return {
        data: response.data.data.map(terrain => ({
          id_terrain: terrain.id_terrain,
          nom_terrain: terrain.nom_terrain,
          capacite: terrain.capacite,
          type: terrain.type,
          prix: terrain.prix,
          image: terrain.image_path,
          created_at: terrain.created_at,
          updated_at: terrain.updated_at
        })),
        meta: response.data.meta,
        links: response.data.links
      };
    } catch (error) {
      console.error('Error fetching terrains:', error);
      throw error;
    }
  },

  async createTerrain(formData) {
    try {
      const response = await apiClient.post(terrainEndpoints.createTerrain, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating terrain:', error);
      throw error;
    }
  },

  async updateTerrain(id, payload) {
    try {
      const response = await apiClient.put(terrainEndpoints.updateTerrain(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating terrain ${id}:`, error);
      throw error;
    }
  },

  async deleteTerrain(id) {
    try {
      const response = await apiClient.delete(terrainEndpoints.deleteTerrain(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting terrain ${id}:`, error);
      throw error;
    }
  }
};

export default terrainService; 
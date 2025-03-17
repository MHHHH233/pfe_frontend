import terrainEndpoints from '../../endpoint/admin/terrain';
import apiClient from '../../adminapi';

const terrainService = {
  async getAllTerrains(params = {}) {
    try {
      const response = await apiClient.get(terrainEndpoints.getAllTerrains, { params });
      return {
        data: response.data.data.map(terrain => ({
          id: terrain.id_terrain,
          name: terrain.nom_terrain,
          capacity: terrain.capacite,
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

  async updateTerrain(id, formData) {
    try {
      const payload = {
        nom_terrain: formData.name,
        capacite: formData.capacity,
        type: formData.type,
        prix: formData.prix,
        image: formData.image
      };
      const response = await apiClient.patch(terrainEndpoints.updateTerrain(id), payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
import academieProgrammesEndpoints from '../../endpoint/admin/academieProgrammes';
import apiClient from '../../userapi';

const academieProgrammesService = {
  async getAllProgrammes(params = {}) {
    try {
      const response = await apiClient.get(academieProgrammesEndpoints.getAllProgrammes, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching programmes:', error);
      throw error;
    }
  },

  async createProgramme(formData) {
    try {
      const response = await apiClient.post(academieProgrammesEndpoints.createProgramme, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating programme:', error);
      throw error;
    }
  },

  async updateProgramme(id, payload) {
    try {
      const response = await apiClient.put(academieProgrammesEndpoints.updateProgramme(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating programme ${id}:`, error);
      throw error;
    }
  },

  async deleteProgramme(id) {
    try {
      const response = await apiClient.delete(academieProgrammesEndpoints.deleteProgramme(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting programme ${id}:`, error);
      throw error;
    }
  }
};

export default academieProgrammesService; 
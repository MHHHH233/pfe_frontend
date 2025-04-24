import academieProgrammesEndpoints from '../../endpoint/user/academieProgrammes';
import apiClient from '../../userapi';

const academieProgrammesService = {
  async getAllProgrammes(params = {}) {
    try {
      // Support for paginationSize, sort_by, sort_order, search, id_academie
      const queryParams = {
        paginationSize: params.paginationSize || 10,
        sort_by: params.sort_by,
        sort_order: params.sort_order,
        search: params.search,
        id_academie: params.id_academie
      };

      const response = await apiClient.get(academieProgrammesEndpoints.getAllProgrammes, { 
        params: queryParams 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching programmes:', error);
      throw error;
    }
  },

  async getProgramme(id) {
    try {
      const response = await apiClient.get(academieProgrammesEndpoints.getProgramme(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching programme ${id}:`, error);
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
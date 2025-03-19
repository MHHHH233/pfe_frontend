import academieEndpoints from '../../endpoint/admin/academie';
import apiClient from '../../userapi';

const academieService = {
  async getAllAcademies(params = {}) {
    try {
      const response = await apiClient.get(academieEndpoints.getAllAcademies, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching academies:', error);
      throw error;
    }
  },

  async createAcademie(formData) {
    try {
      const response = await apiClient.post(academieEndpoints.createAcademie, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating academie:', error);
      throw error;
    }
  },

  async updateAcademie(id, payload) {
    try {
      const response = await apiClient.put(academieEndpoints.updateAcademie(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating academie ${id}:`, error);
      throw error;
    }
  },

  async deleteAcademie(id) {
    try {
      const response = await apiClient.delete(academieEndpoints.deleteAcademie(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting academie ${id}:`, error);
      throw error;
    }
  }
};

export default academieService; 
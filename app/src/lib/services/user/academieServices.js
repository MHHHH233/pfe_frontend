import academieEndpoints from '../../endpoint/user/academie';
import apiGuest from '../../userapi';

const academieService = {
  async getAllAcademies(params = {}) {
    try {
      const response = await apiGuest.get(academieEndpoints.getAllAcademies, { params });
      return {
        success: true,
        data: response.data // This will be the array containing the academies
      };
    } catch (error) {
      console.error('Error fetching academies:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch academies'
      };
    }
  },

  async getAcademie(id) {
    try {
      const response = await apiGuest.get(academieEndpoints.getAcademie(id));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Error fetching academie ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to fetch academie details'
      };
    }
  },

  async createAcademie(formData) {
    try {
      const response = await apiGuest.post(academieEndpoints.createAcademie, formData, {
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
      const response = await apiGuest.put(academieEndpoints.updateAcademie(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating academie ${id}:`, error);
      throw error;
    }
  },

  async deleteAcademie(id) {
    try {
      const response = await apiGuest.delete(academieEndpoints.deleteAcademie(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting academie ${id}:`, error);
      throw error;
    }
  }
};

export default academieService; 
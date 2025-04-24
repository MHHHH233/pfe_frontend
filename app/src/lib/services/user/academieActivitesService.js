import academieActivitesEndpoints from '../../endpoint/user/academieActivites';
import apiClient from '../../userapi';

const academieActivitesService = {
  async getAllActivites(params = {}) {
    try {
      // Support for include, sort_by, sort_order, search, id_academie
      const queryParams = {
        include: params.include,
        sort_by: params.sort_by,
        sort_order: params.sort_order,
        search: params.search,
        id_academie: params.id_academie,
        paginationSize: params.paginationSize || 10
      };

      const response = await apiClient.get(academieActivitesEndpoints.getAllActivites, { 
        params: queryParams 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  async getActivite(id, params = {}) {
    try {
      const queryParams = {
        include: params.include
      };

      const response = await apiClient.get(academieActivitesEndpoints.getActivite(id), {
        params: queryParams
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error);
      throw error;
    }
  },

  // async createActivite(formData) {
  //   try {
  //     const response = await apiClient.post(academieActivitesEndpoints.createActivite, formData);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error creating activity:', error);
  //     throw error;
  //   }
  // },

  // async updateActivite(id, payload) {
  //   try {
  //     const response = await apiClient.put(academieActivitesEndpoints.updateActivite(id), payload);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error updating activity ${id}:`, error);
  //     throw error;
  //   }
  // },

  // async deleteActivite(id) {
  //   try {
  //     const response = await apiClient.delete(academieActivitesEndpoints.deleteActivite(id));
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error deleting activity ${id}:`, error);
  //     throw error;
  //   }
  // }
};

export default academieActivitesService; 
import activitiesMembersEndpoints from '../../endpoint/user/activitiesMembers';
import apiClient from '../../userapi';

const activitiesMembersService = {
  async getAllMembers(params = {}) {
    try {
      const response = await apiClient.get(activitiesMembersEndpoints.getAllMembers, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching activity members:', error);
      throw error;
    }
  },

  async createMember(formData) {
    try {
      const response = await apiClient.post(activitiesMembersEndpoints.createMember, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating activity member:', error);
      throw error;
    }
  },

  async deleteMember(id) {
    try {
      const response = await apiClient.delete(activitiesMembersEndpoints.deleteMember(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting activity member ${id}:`, error);
      throw error;
    }
  },

  async getActivitesIn(id, params = {}) {
    try {
      const queryParams = {
        include: params.include,
        paginationSize: params.paginationSize || 10,
        sort_by: params.sort_by,
        sort_order: params.sort_order,
      };
      
      const response = await apiClient.get(activitiesMembersEndpoints.getActivitesIn(id), { 
        params: queryParams 
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching activities for member ${id}:`, error);
      throw error;
    }
  }
};

export default activitiesMembersService; 
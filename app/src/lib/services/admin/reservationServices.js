import  reservationEndpoints from '../../endpoint/admin/reservation'
import apiClient from '../../userapi'
const reservationService = {
  async getAllReservations(params = {}) {
    try {
      const queryParams = {
        ...params,
        per_page: params.per_page || 100
      };
      
      const response = await apiClient.get(reservationEndpoints.getAllReservations, { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },

  async getReservation(id, params = {}) {
    try {
      const response = await apiClient.get(reservationEndpoints.getReservation(id), params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      throw error;
    }
  },

  async createReservation(data) {
    try {
      console.log('Creating reservation with data:', data);
      
      const response = await apiClient.post(reservationEndpoints.createReservation, {
        id_terrain: data.id_terrain,
        date: data.date,
        heure: data.heure,
        type: data.type,
        id_client: data.id_client,
        Name: data.Name,
        email: data.email,
        telephone: data.telephone
      });
      
      return response;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  async updateReservation(id, data) {
    try {
      const response = await apiClient.put(reservationEndpoints.updateReservation(id), data);
      return response;
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  },

  async deleteReservation(id) {
    try {
      const response = await apiClient.delete(reservationEndpoints.deleteReservation(id));
      return response;
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
      throw error;
    }
  },

  async validateReservation(id, data) {
    try {
      const response = await apiClient.patch(reservationEndpoints.updateStatus(id), data);
      return response;
    } catch (error) {
      console.error('Error validating reservation:', error);
      throw error;
    }
  },

  async invalidateReservation(id, data) {
    try {
      const response = await apiClient.patch(reservationEndpoints.updateStatus(id), data);
      return response;
    } catch (error) {
      console.error('Error invalidating reservation:', error);
      throw error;
    }
  },
  
}

export default reservationService; 
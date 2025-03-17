import  reservationEndpoints from '../../endpoint/user/reservation'
import apiGuest from '../../userapi'
const reservationService = {
  async getAllReservations(params = {}) {
    try {
      const response = await apiGuest.get(reservationEndpoints.getAllReservations, params);
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },

  async getReservation(id, params = {}) {
    try {
      const response = await apiGuest.get(reservationEndpoints.getReservation(id), params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      throw error;
    }
  },

  async createReservation(data) {
    try {
      const response = await apiGuest.post(reservationEndpoints.createReservation, data);
      return response;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  async updateReservation(id, data) {
    try {
      const response = await apiGuest.put(reservationEndpoints.updateReservation(id), data);
      return response;
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  },

  async deleteReservation(id) {
    try {
      const response = await apiGuest.delete(reservationEndpoints.deleteReservation(id));
      return response;
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
      throw error;
    }
  },

  
  
}

export default reservationService; 
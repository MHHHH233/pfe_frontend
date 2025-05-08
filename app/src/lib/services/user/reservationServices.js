import reservationEndpoints from '../../endpoint/user/reservation'
import apiGuest from '../../userapi'

const reservationService = {
  async getAllReservations(params = {}) {
    try {
      const response = await apiGuest.get(reservationEndpoints.getAllReservations, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },

  async getReservation(id, params = {}) {
    try {
      const response = await apiGuest.get(reservationEndpoints.getReservation(id), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      throw error;
    }
  },

  async createReservation(data) {
    try {
      const response = await apiGuest.post(reservationEndpoints.createReservation, data);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  async updateReservation(id, data) {
    try {
      const response = await apiGuest.put(reservationEndpoints.updateReservation(id), data);
      return response.data;
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  },

  async deleteReservation(id) {
    try {
      const response = await apiGuest.delete(reservationEndpoints.deleteReservation(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
      throw error;
    }
  },

  async getUpcomingReservations() {
    try {
      const response = await apiGuest.get(reservationEndpoints.getUpcomingReservations);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming reservations:', error);
      throw error;
    }
  },

  async getReservationHistory(params = {}) {
    try {
      const response = await apiGuest.get(reservationEndpoints.getReservationHistory, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reservation history:', error);
      throw error;
    }
  },

  async cancelReservation(id) {
    try {
      const response = await apiGuest.delete(reservationEndpoints.deleteReservation(id));
      return response.data;
    } catch (error) {
      console.error(`Error cancelling reservation ${id}:`, error);
      throw error;
    }
  },

  async getWeekReservations(date) {
    try {
      const response = await apiGuest.get(reservationEndpoints.getWeekReservations(date));
      return response.data;
    } catch (error) {
      console.error('Error fetching week reservations:', error);
      throw error;
    }
  },

  async searchReservations(query) {
    try {
      const response = await apiGuest.get(reservationEndpoints.searchReservations(query));
      return response.data;
    } catch (error) {
      console.error('Error searching reservations:', error);
      throw error;
    }
  },

  async filterByStatus(status) {
    try {
      const response = await apiGuest.get(reservationEndpoints.filterByStatus(status));
      return response.data;
    } catch (error) {
      console.error('Error filtering reservations by status:', error);
      throw error;
    }
  },

  async filterByDate(date) {
    try {
      const response = await apiGuest.get(reservationEndpoints.filterByDate(date));
      return response.data;
    } catch (error) {
      console.error('Error filtering reservations by date:', error);
      throw error;
    }
  },

  async filterByTerrain(terrainId) {
    try {
      const response = await apiGuest.get(reservationEndpoints.filterByTerrain(terrainId));
      return response.data;
    } catch (error) {
      console.error('Error filtering reservations by terrain:', error);
      throw error;
    }
  },

  async filterByClient(clientId) {
    try {
      const response = await apiGuest.get(reservationEndpoints.filterByClient(clientId));
      return response.data;
    } catch (error) {
      console.error('Error filtering reservations by client:', error);
      throw error;
    }
  },

  async getReservationsPage(page, perPage = 10) {
    try {
      const response = await apiGuest.get(reservationEndpoints.getReservationsPage(page, perPage));
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations page:', error);
      throw error;
    }
  }
}

export default reservationService; 
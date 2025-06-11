import reservationEndpoints from '../../endpoint/user/reservation'
import apiGuest from '../../userapi'

const reservationService = {
  async getAllReservations(params = {}) {
    try {
      const queryParams = {
        ...params,
        per_page: params.per_page || 100
      };
      
      const response = await apiGuest.get(reservationEndpoints.getAllReservations, { params: queryParams });
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
      // Create a copy of data to avoid modifying the original object
      const reservationData = { ...data };
      
      // Validate and fix online payment data
      if (reservationData.payment_method === 'online' || reservationData.payment_method === 'stripe') {
        // If amount is missing, calculate it from price or prix
        if (!reservationData.amount) {
          const price = parseFloat(reservationData.price || reservationData.prix || 100);
          // Check if price is already in cents (a large number)
          if (price >= 1000) {
            console.log('Price appears to already be in cents:', price);
            reservationData.amount = Math.round(price);
          } else {
            console.log('Converting price to cents:', price, '->', Math.round(price * 100));
            reservationData.amount = Math.round(price * 100); // Convert to cents for Stripe
          }
        } else {
          // Ensure amount is an integer in cents
          reservationData.amount = Math.round(parseFloat(reservationData.amount));
        }
        
        // If currency is missing, add default 'mad'
        if (!reservationData.currency) {
          reservationData.currency = 'mad';
        }
        
        // Log the amount to verify it's correct
        console.log('Final amount being sent to API:', reservationData.amount);
      }
      
      const response = await apiGuest.post(reservationEndpoints.createReservation, reservationData);
      
      // If the response was successful, store some data in sessionStorage for recovery
      if (response.data && response.data.id) {
        try {
          // Store last successful reservation ID
          sessionStorage.setItem('last_successful_reservation_id', response.data.id);
          // If this was a payment, store the payment intent ID
          if (reservationData.payment_intent_id) {
            sessionStorage.setItem('last_reservation_payment_id', reservationData.payment_intent_id);
          }
          // Store timestamp
          sessionStorage.setItem('last_reservation_timestamp', Date.now().toString());
          
          // If the user is logged in, refresh the reservation count from the server
          if (sessionStorage.getItem("userId") && 
              sessionStorage.getItem("type") !== "admin" && 
              (reservationData.payment_method === 'online' || reservationData.payment_status === 'paid')) {
            
            // Call the refreshReservationCount method directly using 'this'
            await this.refreshReservationCount();
            
            // Dispatch an event to navigate to the profile page
            // This will be caught by components to handle the navigation
            const navigationEvent = new CustomEvent('navigateToProfile', {
              detail: { 
                reservationId: response.data.id,
                redirectAfterDelay: true,
                delay: 2000 // Navigate after 2 seconds to allow confirmation message to be seen
              }
            });
            document.dispatchEvent(navigationEvent);
          }
        } catch (storageError) {
          console.warn('Could not store reservation data in sessionStorage:', storageError);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      
      // Check for validation errors
      if (error.response && error.response.data && error.response.data.error) {
        console.error('Validation errors:', error.response.data.error);
        throw {
          message: 'Validation error',
          errors: error.response.data.error
        };
      }
      
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
  },

  async refreshReservationCount() {
    try {
      const response = await apiGuest.get(reservationEndpoints.refreshReservationCount);
      
      // Update the session storage with the latest count
      // The response has today_reservations_count instead of count
      if (response.data && response.data.today_reservations_count !== undefined) {
        sessionStorage.setItem('today_reservations_count', response.data.today_reservations_count.toString());
        
        // Also store the server timestamp for reference
        if (response.data.timestamp) {
          sessionStorage.setItem('last_count_refresh', response.data.timestamp.toString());
        }
        
        // Store today's date from server
        if (response.data.today_date) {
          sessionStorage.setItem('server_today_date', response.data.today_date);
        }
        
        // Store recent reservations if available
        if (response.data.recent_reservations) {
          try {
            sessionStorage.setItem('recent_reservations', JSON.stringify(response.data.recent_reservations));
          } catch (e) {
            console.error("Failed to store recent reservations:", e);
          }
        }
        
        return response.data.today_reservations_count;
      }
      
      return parseInt(sessionStorage.getItem('today_reservations_count') || '0');
    } catch (error) {
      console.error('Error refreshing reservation count:', error);
      // Return current count from session storage if API call fails
      return parseInt(sessionStorage.getItem('today_reservations_count') || '0');
    }
  }
}

export default reservationService; 
import eventsEndpoints from '../../endpoint/user/events';
import apiClient from '../../userapi';

const eventsService = {
  async getAllEvents() {
    try {
      const response = await apiClient.get(eventsEndpoints.getAllEvents);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  async getEvent(id) {
    try {
      const response = await apiClient.get(eventsEndpoints.getEvent(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  async getPaginatedEvents(page = 1, size = 10, search = '', sortBy = 'date_debut', sortOrder = 'desc') {
    try {
      const params = new URLSearchParams({
        page,
        paginationSize: size,
        sort_by: sortBy,
        sort_order: sortOrder
      });

      if (search) {
        params.append('search', search);
      }

      const response = await apiClient.get(`${eventsEndpoints.getAllEventsPaginated(page, size)}&${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated events:', error);
      throw error;
    }
  }
};

export default eventsService; 
import chatbotEndpoints from '../../endpoint/user/chatbot';
import apiClient from '../../userapi';

const chatbotService = {
  /**
   * Send a message to the chatbot
   * @param {string} message - The message to send to the chatbot
   * @param {Object} options - Additional options
   * @param {string} options.systemMessage - Optional system message to override default
   * @param {string} options.model - Optional model to use
   * @returns {Promise} - The response from the API
   */
  async sendMessage(message, options = {}) {
    try {
      const payload = {
        message,
        ...options
      };

      const response = await apiClient.post(chatbotEndpoints.sendMessage, payload);
      return response.data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },

  /**
   * Clear the conversation history
   * @returns {Promise} - The response from the API
   */
  async clearConversation() {
    try {
      const response = await apiClient.post(chatbotEndpoints.clearConversation);
      return response.data;
    } catch (error) {
      console.error('Error clearing chatbot conversation:', error);
      throw error;
    }
  },

  /**
   * Get available AI models from OpenRouter
   * @returns {Promise} - The response from the API with available models
   */
  async getAvailableModels() {
    try {
      const response = await apiClient.get(chatbotEndpoints.getAvailableModels);
      return response.data;
    } catch (error) {
      console.error('Error fetching available models:', error);
      throw error;
    }
  }
};

export default chatbotService; 
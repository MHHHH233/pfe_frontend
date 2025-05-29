const BASE_URL = '/api/user/v1/chatbot';
const chatbotEndpoints = {
  sendMessage: `${BASE_URL}/send`,
  clearConversation: `${BASE_URL}/clear`,
  getAvailableModels: `${BASE_URL}/models`,
};

export default chatbotEndpoints; 
import userapi from '../../userapi';
import socialMediaEndpoints from '../../endpoint/admin/socialMedia';

const socialMediaService = {
  // Get social media information
  getSocialMedia: async () => {
    try {
      const response = await userapi.get(socialMediaEndpoints.getSocialMedia);
      return response.data;
    } catch (error) {
      console.error('Error fetching social media data:', error);
      throw error;
    }
  },
  
  // Update social media information
  updateSocialMedia: async (data) => {
    try {
      const response = await userapi.put(socialMediaEndpoints.updateSocialMedia, data);
      return response.data;
    } catch (error) {
      console.error('Error updating social media data:', error);
      throw error;
    }
  },
};

export default socialMediaService; 
import userapi from '../../userapi';
import socialMediaEndpoints from '../../endpoint/user/socialMedia';

export const socialMediaService = {
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
}; 
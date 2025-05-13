import userapi from '../../userapi';
import contactEndpoints from '../../endpoint/user/contact';

export const contactService = {
  // Submit contact form
  submitContact: async (formData) => {
    try {
      const response = await userapi.post(contactEndpoints.submitContact, {
        nom: formData.name,
        email: formData.email,
        sujet: formData.subject,
        message: formData.message
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
}; 
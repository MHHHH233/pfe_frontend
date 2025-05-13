const BASE_URL = '/api/user/v1';

const profileEndpoints = {
  // Get authenticated user's profile
  getProfile: `${BASE_URL}/profile`,
  
  // Update user's profile
  updateProfile: `${BASE_URL}/updateProfile`,
  
  // Upload profile picture
  updateProfilePicture: `${BASE_URL}/updateProfilePicture`,
  
  // Change user's password
  changePassword: `${BASE_URL}/changePassword`,
  
  // Get user's activity history
  activityHistory: `${BASE_URL}/activityHistory`,
  
  // Report a bug
  reportBug: `${BASE_URL}/reportBug`,
  
  // Reset password (admin only)
  resetPassword: (id) => `${BASE_URL}/comptes/${id}/reset-password`,
  deleteAccount: (id) => `${BASE_URL}/comptes/${id}/deleteAccount`
};

export default profileEndpoints; 
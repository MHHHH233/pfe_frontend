import { autho } from "../endpoint/autho";
import guestapi from "../guestapi";
import userapi from "../userapi";
import googleAuthService from "./googleAuthService";

export const authService = {
  login: async (data) => {
    const response = await guestapi.post(autho.login(), data);
    return response.data;
  },

  register: async (data) => {
    const response = await guestapi.post(autho.register(), data);
    return response.data;
  },

  logout: async () => {
    await userapi.get(autho.logout());
  },

  googleRedirect: async () => {
    return await googleAuthService.initiateGoogleAuth();
  },

  handleGoogleCallback: async (callbackUrl) => {
    return await googleAuthService.handleGoogleCallback(callbackUrl);
  },
  
  isGoogleAuthenticated: () => {
    return googleAuthService.isGoogleAuthenticated();
  }
};

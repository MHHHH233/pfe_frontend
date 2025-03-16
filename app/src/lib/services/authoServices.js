import { autho } from "../endpoint/autho";
import guestapi from "../guestapi";
import userapi from "../userapi";

export const authService = {
  login: async (data) => {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    console.log('Login endpoint:', autho.login());
    console.log('Request data:', data);
    
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
};

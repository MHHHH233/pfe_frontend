const BASE_URL = "/api/";

export const autho = {
  baseUrl: BASE_URL,
  login: () => `${BASE_URL}login`,
  register: () => `${BASE_URL}register`,
  logout: () => `${BASE_URL}logout`,
  me: () => `${BASE_URL}me`,
  getUserByToken: (token) => `${BASE_URL}getUserByToken/${token}`,
};

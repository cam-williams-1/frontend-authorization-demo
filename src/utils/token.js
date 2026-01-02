const TOKEN_KEY = "jwt";

// accepts the token as an argument and adds it to localStorage as the key TOKEN_KEY.
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

// retrieves and returns the value associated with TOKEN_KEY from localStorage.
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

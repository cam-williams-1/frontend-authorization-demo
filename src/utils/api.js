export const BASE_URL = "https://api.nomoreparties.co";

// accepts a JSON web token(jwt) as an argument
export const getUserInfo = (token) => {
  // Send a GET request to /users/me
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Specify an authorization header with an appropriately formatted value
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  });
};

// This function accepts one argument: a JSON web token. It will then send a GET request to /users/me,
// and if the token is valid, it will return a response that contains the user’s information.
// If the request is successful, we know the user is authenticated, and we can log them in.

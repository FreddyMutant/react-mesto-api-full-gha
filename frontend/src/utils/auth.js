import { apiSettings, SERVER_ERRORS } from "./utils";

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(SERVER_ERRORS[res.status]);
  }
};

export const register = (registerData) => {
  return fetch(`${apiSettings.serverURL}/signup`, {
    method: "POST",
    headers: apiSettings.headers,
    body: JSON.stringify(registerData),
  }).then((res) => handleResponse(res));
};

export const authorize = (loginData) => {
  return fetch(`${apiSettings.serverURL}/signin`, {
    method: "POST",
    headers: apiSettings.headers,
    body: JSON.stringify(loginData),
  }).then((res) => handleResponse(res));
};

export const tokenCheck = (token) => {
  return fetch(`${apiSettings.serverURL}/users/me`, {
    method: "GET",
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
      ...apiSettings.headers,
    },
  }).then((res) => handleResponse(res));
};

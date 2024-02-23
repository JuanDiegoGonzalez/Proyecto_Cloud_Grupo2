// auth.js

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';


// Guardar el token, nombre de usuario y imagen en localStorage
export const saveAuthData = (token, username) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
};

// Obtener el token desde localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Obtener el nombre de usuario desde localStorage
export const getUsername = () => {
  return localStorage.getItem(USERNAME_KEY);
};

// Eliminar el token, nombre de usuario y imagen de localStorage
export const removeAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
};

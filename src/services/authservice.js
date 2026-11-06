import { getCurrentSession, loginRequest, logoutRequest } from "../modules/auth/services/authApi.js";
import { AUTH_TOKEN_KEY } from "../api/apiClient.js";

export const IniciarSesion = async (username, password) => {
  const response = await loginRequest({ username, password });
  globalThis.sessionStorage?.setItem(AUTH_TOKEN_KEY, response.token);
  globalThis.localStorage?.setItem("username", response.username);
  globalThis.localStorage?.setItem("id_usuario", String(response.idUsuario));
  return response;
};

export const obtenerSesion = getCurrentSession;
export const cerrarSesion = logoutRequest;

import { apiClient } from "../../../api/apiClient.js";

let sessionRequest;

export const loginRequest = async (credentials) => {
  const { data } = await apiClient.post("/auth/login", credentials);

  if (data?.status !== "ok" || typeof data.token !== "string" || !data.token) {
    throw new Error(data?.message || "El servidor no devolvió un token de acceso válido");
  }

  return data;
};

export const getCurrentSession = () => {
  if (!sessionRequest) {
    sessionRequest = apiClient
      .get("/auth/me")
      .then(({ data }) => data)
      .finally(() => {
        sessionRequest = undefined;
      });
  }

  return sessionRequest;
};

export const logoutRequest = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

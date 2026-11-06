import { apiClient } from "../../../api/apiClient.js";

export const consultarPermisosPropios = async ({ signal }) => {
  const { data } = await apiClient.get("/auth/permisos", { signal });
  return data;
};

export const listarMatriz = async ({ usuarioId, moduloId, page, size, signal }) => {
  const { data } = await apiClient.get("/reglas/matriz", {
    params: { usuarioId, moduloId: moduloId ?? undefined, page, size }, signal,
  });
  return data;
};

export const listarUsuariosReglas = async ({ search, page, size, signal }) => {
  const { data } = await apiClient.get("/reglas/usuarios", { params: { search, page, size }, signal });
  return data;
};

export const listarModulosReglas = async ({ search, page, size, signal }) => {
  const { data } = await apiClient.get("/reglas/modulos", { params: { search, page, size }, signal });
  return data;
};

export const cambiarPermiso = async ({ usuarioId, moduloId, accion, valor }) => {
  await apiClient.patch("/reglas/permisos", { usuarioId, moduloId, accion, valor });
};
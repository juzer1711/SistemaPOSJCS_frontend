import { apiClient } from "../../../api/apiClient.js";

export const listarModulos = async ({ page, size, nombreModulo, zona, sort, signal }) => {
  const params = { page, size, sort: `${sort.field},${sort.direction}` };
  const nombre = nombreModulo.trim();
  const zonaNormalizada = zona.trim();
  const hasFilters = nombre || zonaNormalizada;
  if (nombre) params.nombreModulo = nombre;
  if (zonaNormalizada) params.zona = zonaNormalizada;

  const { data } = await apiClient.get(hasFilters ? "/modulos/search" : "/modulos", {
    params,
    signal,
  });
  return data;
};

export const crearModulo = async (modulo) => {
  const { data } = await apiClient.post("/modulos", modulo);
  return data;
};

export const actualizarModulo = async (idModulo, modulo) => {
  const { data } = await apiClient.put(`/modulos/${idModulo}`, modulo);
  return data;
};

export const consultarCodigoDisponible = async (codigoModulo, { signal }) => {
  const { data } = await apiClient.get("/modulos/disponibilidad-codigo", {
    params: { codigoModulo }, signal,
  });
  return data.disponible ? "" : "Ya existe un módulo con este código.";
};

export const obtenerModulo = async (idModulo, { signal }) => {
  const { data } = await apiClient.get(`/modulos/${idModulo}`, { signal });
  return data;
};

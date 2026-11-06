import { apiClient } from "../../../api/apiClient.js";

export const listarUsuarios = async ({ page, size, search, estado, tipoDocumento, sort, signal }) => {
  const { data } = await apiClient.get("/users/search", {
    params: { page, size, search: search?.trim() || undefined,
      estado: estado === "" ? undefined : estado, tipoDocumento: tipoDocumento || undefined,
      sort: sort.field + "," + sort.direction }, signal,
  });
  return data;
};
export const listarTiposDocumento = async ({ signal }) => (await apiClient.get("/users/tipos-documento", { signal })).data;
export const crearUsuario = async (values) => (await apiClient.post("/users", values)).data;
export const actualizarUsuario = async (id, values) => (await apiClient.put("/users/" + id, values)).data;
export const cambiarEstadoUsuario = (id, active) => apiClient.patch("/users/" + (active ? "activar/" : "desactivar/") + id, {});
export const exportarUsuariosExcel = (params) => apiClient.get("/export/usuarios/excel", { params, responseType: "blob" });
export const exportarUsuariosCSV = (params) => apiClient.get("/export/usuarios/csv", { params, responseType: "blob" });

// Compatibilidad con consumidores legacy (cajas) que reciben una respuesta Axios.
export const buscarUsuariosRespuesta = (params) => apiClient.get("/users/search", { params });
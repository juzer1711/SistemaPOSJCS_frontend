import { apiClient } from "../../../api/apiClient.js";

const EMPRESA_URL = "/empresa";

export const getEmpresa = async () => {
  try {
    const response = await apiClient.get(EMPRESA_URL);
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};

export const createEmpresa = async (empresaData, setupToken) => {
  try {
    const response = await apiClient.post(EMPRESA_URL, empresaData, {
      headers: setupToken?.trim()
        ? { "X-Empresa-Setup-Token": setupToken.trim() }
        : undefined,
    });
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};

export const updateEmpresa = async (id, empresaData) => {
  try {
    const response = await apiClient.put(`${EMPRESA_URL}/${id}`, empresaData);
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};

export const existsEmpresa = async () => {
  try {
    await getEmpresa();
    return true;
  } catch (error) {
    if (error.status === 404) return false;
    throw error;
  }
};

export const uploadLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(`${EMPRESA_URL}/logo`, formData);
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};

function formatApiError(error) {
  if (error.response) {
    const data = error.response.data;
    const message = data?.message || data?.detail || data?.error || "Error en la solicitud";
    const formattedError = new Error(message);
    formattedError.status = error.response.status;
    formattedError.raw = data;
    return formattedError;
  }

  const formattedError = new Error(
    error.message === "Network Error"
      ? "No se pudo conectar al servidor"
      : error.message || "No fue posible completar la solicitud"
  );
  formattedError.cause = error;
  return formattedError;
}

const empresaApi = {
  getEmpresa,
  createEmpresa,
  updateEmpresa,
  existsEmpresa,
  uploadLogo,
};

export default empresaApi;

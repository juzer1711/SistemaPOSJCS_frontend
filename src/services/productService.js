import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

const API_URL = `${API_BASE_URL}/productos`;

// Obtener headers dinámicamente
const getRequestHeaders = () => ({
  "Content-Type": "application/json",
});

// SEARCH 
export const searchProducts = (params) => {
  return axios.get(`${API_URL}/search`, {
    params,
    headers: getRequestHeaders()
  });
};

// GET Active Products
export const getActiveProducts = async () => {
  return await axios.get(`${API_URL}`, {
    headers: getRequestHeaders(),
  });
};

// GET Inactive Products
export const getInactiveProducts = async () => {
  return await axios.get(`${API_URL}/inactivos`, {
    headers: getRequestHeaders(),
  });
};

// GET Categorias
export const getCategorias = async () => {
  return await axios.get(`${API_BASE_URL}/categorias`, {
    headers: getRequestHeaders(),
  });
};

// Desactivar producto (borrado lógico)
export const deactivateProduct = async (id) => {
  return await axios.delete(`${API_URL}/desactivar/${id}`, {
    headers: getRequestHeaders(),
  });
};

// Activar producto
export const activateProduct = async (id) => {
  return await axios.put(`${API_URL}/activar/${id}`, {}, {
    headers: getRequestHeaders(),
  });
};

// GET BY ID
export const getProductoById = async (id) => {
   return await axios.get(`${API_URL}/${id}`, {
    headers: getRequestHeaders(),
  });
};

// CREATE
export const createProduct = async (productData) => {
  try {
    const res = await axios.post(API_URL, productData, {
      headers: getRequestHeaders(),
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// CREATE categorias
export const createCategoria = async (categoriaData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/categorias`, categoriaData, {
      headers: getRequestHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// UPDATE
export const updateProduct = async (id, productData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, productData, {
      headers: getRequestHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// UPDATE Stock mínimo (regla de inventario)
export const updateStockMinimo = async (id, stockMinimo) => {
  try {
    const res = await axios.patch(
      `${API_URL}/${id}/stock-minimo`,
      null,
      {
        params: { stockMinimo },
        headers: getRequestHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// UPDATE Categoria
export const updateCategoria = async (id, categoriaData) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/categorias/${id}`, categoriaData, {
      headers: getRequestHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// Manejo de errores
function formatAxiosError(error) {
  if (error.response) {
    const data = error.response.data;

    const err = new Error(data?.message || "Error del servidor");

    err.status = error.response.status;
    err.raw = data;
    err.field = data?.field; // 🔥 CLAVE

    return err;
  }

  return new Error("No se pudo conectar al servidor");
}
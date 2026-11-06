import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

const API_URL = `${API_BASE_URL}/inventario`;

const getRequestHeaders = () => ({
  "Content-Type": "application/json",
});

// 📦 Obtener stock de un producto
export const getStockByProducto = async (idProducto) => {
  return await axios.get(`${API_URL}/stock/${idProducto}`, {
    headers: getRequestHeaders(),
  });
};

// 📜 Historial con paginación y filtros
export const getMovimientos = async (params) => {
  return await axios.get(`${API_URL}/movimientos`, {
    params: { ...params, sort: "fecha,desc" },
    headers: getRequestHeaders(),
  });
};

// ➕ Entrada de inventario
export const registrarEntrada = async (data) => {
  return await axios.post(`${API_URL}/entrada`, data, {
    headers: getRequestHeaders(),
  });
};

// ➖ Salida manual (daños, ajustes, etc.)
export const registrarSalida = async (data) => {
  return await axios.post(`${API_URL}/salida`, data, {
    headers: getRequestHeaders(),
  });
};
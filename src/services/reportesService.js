import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

const API_URL = `${API_BASE_URL}/reportes`;

// 🔐 Headers con token dinámico
const getRequestHeaders = () => ({
  "Content-Type": "application/json",
});

// 📊 Resumen general
export const getReporteResumen = () => {
  return axios.get(`${API_URL}/resumen`, {
    headers: getRequestHeaders(),
  });
};

// 💳 Ventas por método de pago
export const getVentasPorMetodoPago = () => {
  return axios.get(`${API_URL}/metodos-pago`, {
    headers: getRequestHeaders(),
  });
};

// 🏆 Top productos vendidos
export const getTopProductos = () => {
  return axios.get(`${API_URL}/top-productos`, {
    headers: getRequestHeaders(),
  });
};

// 🧑‍💼 Ventas por cajero
export const getVentasPorCajero = () => {
  return axios.get(`${API_URL}/ventas-cajero`, {
    headers: getRequestHeaders(),
  });
};

// 📦 Stock (critico / bajo / normal)
export const getStock = (tipo) => {
  return axios.get(`${API_URL}/stock`, {
    params: { tipo }, // critico | bajo | normal
    headers: getRequestHeaders(),
  });
};
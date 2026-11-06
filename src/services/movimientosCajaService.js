import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

const API_URL = `${API_BASE_URL}/movimientos-caja`;

const getRequestHeaders = () => ({
  "Content-Type": "application/json",
});

export const registrarMovimientoCaja = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: getRequestHeaders(),
  });
  return res.data;
};

export const getMovimientosPorCaja = async (idCaja) => {
  const res = await axios.get(`${API_URL}/caja/${idCaja}`, {
    headers: getRequestHeaders(),
  });
  return res.data;
};
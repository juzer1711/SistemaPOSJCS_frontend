import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

const API_URL = `${API_BASE_URL}/export`;

const getRequestHeaders = () => ({});

export const exportVentasExcel = (params) =>
  axios.get(`${API_URL}/ventas/excel`, {
    params,
    headers: getRequestHeaders(),
    responseType: "blob", // ← clave para archivos binarios
  });

export const exportVentasCSV = (params) =>
  axios.get(`${API_URL}/ventas/csv`, {
    params,
    headers: getRequestHeaders(),
    responseType: "blob",
  });

export const exportCajasExcel = (params) =>
  axios.get(`${API_URL}/cajas/excel`, {
    params,
    headers: getRequestHeaders(),
    responseType: "blob",
  });

export const exportCajasCSV = (params) =>
  axios.get(`${API_URL}/cajas/csv`, {
    params,
    headers: getRequestHeaders(),
    responseType: "blob",
  });

// ── CLIENTES ──────────────────────────────────────────────────────
export const exportClientesExcel = (params) =>
  axios.get(`${API_URL}/clientes/excel`, {
    params, headers: getRequestHeaders(), responseType: "blob",
  });

export const exportClientesCSV = (params) =>
  axios.get(`${API_URL}/clientes/csv`, {
    params, headers: getRequestHeaders(), responseType: "blob",
  });

// ── PRODUCTOS ─────────────────────────────────────────────────────
export const exportProductosExcel = (params) =>
  axios.get(`${API_URL}/productos/excel`, {
    params, headers: getRequestHeaders(), responseType: "blob",
  });

export const exportProductosCSV = (params) =>
  axios.get(`${API_URL}/productos/csv`, {
    params, headers: getRequestHeaders(), responseType: "blob",
  });

// ── USUARIOS ──────────────────────────────────────────────────────
// AUDITORIA
export const exportAuditoriaExcel = (params) =>
  axios.get(`${API_URL}/auditoria/excel`, {
    params, headers: getRequestHeaders(), responseType: "blob",
  });

export const exportAuditoriaCSV = (params) =>
  axios.get(`${API_URL}/auditoria/csv`, {
    params, headers: getRequestHeaders(), responseType: "blob",
  });

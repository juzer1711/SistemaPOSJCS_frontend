import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

// ==========================
// AUDITORÍA
// ==========================

export const obtenerAuditoria = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/auditoria`, {
    params,
  });

  return response.data;
};
import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

const API_URL = `${API_BASE_URL}/asistente`;

const getRequestHeaders = () => ({
  "Content-Type": "application/json",
});

export const consultarAsistente = async (pregunta) => {
  try {
    const response = await axios.post(
      `${API_URL}/consultar`,
      { pregunta },
      { headers: getRequestHeaders() }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "No fue posible consultar el asistente.";

      throw new Error(message);
    }

    throw new Error("No se pudo conectar con el asistente.");
  }
};

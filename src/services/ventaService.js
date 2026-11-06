import axios from "axios";
import { API_BASE_URL } from "./apiConfig.js";

const API_URL = `${API_BASE_URL}/ventas`;

// 🔐 Headers con token dinámico
const getRequestHeaders = () => ({
  "Content-Type": "application/json",
});


// 📌 Obtener ventas activas
export const getActiveVentas = (page, size) => {
  return axios.get(`${API_URL}`, {
    params: {
      page: page,
      size: size,
      sort: "fecha,desc"
    },
    headers: getRequestHeaders()
  });
};

// 📌 Obtener ventas inactivas
export const getInactiveVentas = (page, size) => {
  return axios.get(`${API_URL}/inactivas`, {
    params: {
      page: page,
      size: size,
      sort: "fecha,desc"
    },
    headers: getRequestHeaders()
  });
};

// 📌 Obtener venta por ID (para ver detalle)
export const getVentaById = async (id) => {
  return await axios.get(`${API_URL}/${id}`, { headers: getRequestHeaders() });
};

// 📌 Registrar nueva venta (con items)
export const registrarVenta = async (ventaData) => {
  try {
    const res = await axios.post(API_URL, ventaData, {
      headers: getRequestHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// 📌 Activar / Desactivar venta
export const activateVenta = (id) =>
  axios.patch(`${API_URL}/activar/${id}`, {}, { headers: getRequestHeaders() });

export const deactivateVenta = (id) =>
  axios.patch(`${API_URL}/desactivar/${id}`, {},{ headers: getRequestHeaders() });
// 📌 Cambiar método de pago de una venta (cruce contable)
export const cambiarMetodoPago = (idVenta, metodoPago) => {
  return axios.patch(
    `${API_URL}/${idVenta}/metodo-pago`,
    null,
    {
      params: { metodoPago },
      headers: getRequestHeaders(),
    }
  );
};

export const searchVentas = (params) => {
  return axios.get(`${API_URL}/search`, {
    params,
    headers: getRequestHeaders()
  });
};

// 📌 Ventas que pertenecen a una caja (auditoría)
export const getVentasPorCaja = async (idCaja) => {
  try {
    const res = await axios.get(`${API_URL}/por-caja/${idCaja}`, {
      headers: getRequestHeaders(),
    });
    return res.data;
  } catch (error) {
    throw formatAxiosError(error);
  }
};

// 📌 Error handler 
function formatAxiosError(error) {
  if (error.response) {
    const data = error.response.data;

    const backendMessage =
      data?.message ||
      Object.values(data)?.[0] ||
      JSON.stringify(data) ||
      "Error desconocido";

    const err = new Error(backendMessage);
    err.status = error.response.status;
    err.raw = data;
    return err;
  }
  return new Error("No se pudo conectar al servidor");

}

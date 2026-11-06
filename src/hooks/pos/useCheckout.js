import { useState } from "react";
import { registrarVenta } from "../../services/ventaService";
import { useSnackbar } from "../../context/SnackBarProvider";

export const useCheckout = ({
  items,
  clienteSeleccionado,
  metodoPago,
  montoRecibido,
  observaciones,
  setClienteSeleccionado,
  setMetodoPago,
  setMontoRecibido,
  setObservaciones,
  clearCart,
  reloadProductos,
  fetchCajaActiva,
}) => {
  const { showSnackbar } = useSnackbar();

  const [loadingVenta, setLoadingVenta] = useState(false);
  const [openResumen, setOpenResumen] = useState(false);

  // ================= TOTALES DERIVADOS =================

  const total = items.reduce(
    (acc, i) => acc + Number(i.precioUnitario) * Number(i.cantidad),
    0
  );

  const totalIVA = items.reduce(
    (acc, i) => acc + (i.precioUnitario - i.precioSinIva) * i.cantidad,
    0
  );

  const totalSinIVA = items.reduce(
    (acc, i) => acc + i.precioSinIva * i.cantidad,
    0
  );

  const cambio = montoRecibido ? Number(montoRecibido) - total : 0;

  // ================= ACCIÓN PRINCIPAL =================

  const handleConfirm = async () => {
    setLoadingVenta(true);

    if (!clienteSeleccionado) {
      showSnackbar("Selecciona un cliente", "warning");
      setLoadingVenta(false);
      return;
    }
    if (!metodoPago) {
      showSnackbar("Selecciona un método de pago", "warning");
      setLoadingVenta(false);
      return;
    }
    if (items.length === 0) {
      showSnackbar("Carrito vacío", "warning");
      setLoadingVenta(false);
      return;
    }
    if (loadingVenta) return; // evita doble clic

    if (metodoPago === "EFECTIVO" && Number(montoRecibido) < total) {
      showSnackbar("El monto recibido es insuficiente", "warning");
      setLoadingVenta(false);
      return;
    }

    const idUsuario = localStorage.getItem("id_usuario");

    const body = {
      cliente: { idCliente: clienteSeleccionado.idCliente },
      usuario: { idUsuario: Number(idUsuario) },
      metodoPago,
      observaciones,
      montoRecibido: metodoPago === "EFECTIVO" ? Number(montoRecibido) : null,
      items: items.map((i) => ({
        producto: { idProducto: i.idProducto },
        cantidad: i.cantidad,
      })),
    };

    try {
      await registrarVenta(body);
      showSnackbar("✔ Venta registrada correctamente", "success");
      clearCart();
      setClienteSeleccionado(null);
      setMetodoPago("");
      setMontoRecibido("");
      setObservaciones("");
      await reloadProductos();
      await fetchCajaActiva();
    } catch (error) {
      const mensajeReal =
        error.response?.data?.message || error.message || "Error desconocido";
      if (mensajeReal.includes("caja abierta")) {
        showSnackbar("⚠️ Debes abrir una caja antes de vender", "error");
      } else {
        showSnackbar(`Error: ${mensajeReal}`, "error");
      }
    } finally {
      setLoadingVenta(false);
      setOpenResumen(false);
    }
  };

  return {
    // Totales
    total,
    totalIVA,
    totalSinIVA,
    cambio,
    // Estado
    loadingVenta,
    openResumen,
    setOpenResumen,
    // Acción
    handleConfirm,
  };
};
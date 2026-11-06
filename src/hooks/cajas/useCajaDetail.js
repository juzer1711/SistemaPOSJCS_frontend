import { useEffect, useState } from "react";
import { getVentasPorCaja, getVentaById } from "../../services/ventaService";
import { getMovimientosPorCaja } from "../../services/movimientosCajaService";
import { getCajaById } from "../../services/cajaService";
import { cambiarMetodoPago } from "../../services/ventaService";

export const useCajaDetail = ({ open, caja }) => {
  const [ventas, setVentas] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(true);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [ventaOpen, setVentaOpen] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});

  useEffect(() => {
    if (!open || !caja?.idCaja) return;

    const fetchVentas = async () => {
      try {
        setLoadingVentas(true);
        const ventas = await getVentasPorCaja(caja.idCaja);
        setVentas(ventas || []);
      } catch (e) {
        setVentas([]);
      } finally {
        setLoadingVentas(false);
      }
    };

    fetchVentas();
  }, [open, caja?.idCaja]);

  useEffect(() => {
    if (caja?.idCaja) {
      getMovimientosPorCaja(caja.idCaja)
        .then((res) => setMovimientos(res))
        .catch(() => setMovimientos([]));
    }
  }, [caja]);

  const refreshCajaCompleta = async () => {
    if (!caja?.idCaja) return;

    try {
      setLoadingVentas(true);

      const ventasActualizadas = await getVentasPorCaja(caja.idCaja);
      setVentas(ventasActualizadas || []);

      const cajaActualizada = await getCajaById(caja.idCaja);
      Object.assign(caja, cajaActualizada.data); // 🔥 esto actualiza los totales en vivo

    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVentas(false);
    }
  };

  const verDetalleVenta = async (idVenta) => {
    const res = await getVentaById(idVenta);
    setVentaSeleccionada(res.data);
    setVentaOpen(true);
  };

  const solicitarCambioMetodoPago = (venta) => {
    const nuevoMetodo =
      venta.metodoPago === "EFECTIVO"
        ? "TRANSFERENCIA"
        : "EFECTIVO";

    setDialogInfo({
      title: "Cambiar método de pago",
      message: `Vas a cambiar el método de pago de la venta #${venta.idVenta}

  De: ${venta.metodoPago}
  A: ${nuevoMetodo}

  Esto afectará el cuadre contable de la caja.`,
      confirmText: "Cambiar método",
      confirmColor: "warning",
      action: async () => {
        await cambiarMetodoPago(venta.idVenta, nuevoMetodo);
        await refreshCajaCompleta();
      },
    });

    setDialogOpen(true);
  };
  const handleConfirm = async () => {
    setDialogOpen(false);

    try {
      if (dialogInfo.action) {
        await dialogInfo.action();
      }
    } catch (e) {
      console.error(e);
    }
  };
  // Cálculos derivados de caja
  const diferenciaEfectivo =
    Number(caja?.efectivoReal ?? 0) - Number(caja?.totalEfectivo ?? 0);

  const diferenciaTransferencia =
    Number(caja?.transferenciaReal ?? 0) - Number(caja?.totalTransferencia ?? 0);

  return {
    ventas,
    loadingVentas,
    ventaSeleccionada,
    ventaOpen,
    setVentaOpen,
    movimientos,
    verDetalleVenta,
    dialogOpen,
    setDialogOpen,
    dialogInfo,
    handleConfirm,
    solicitarCambioMetodoPago,
    diferenciaEfectivo,
    diferenciaTransferencia,
  };
};
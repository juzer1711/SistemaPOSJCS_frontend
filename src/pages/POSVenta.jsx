import { Box, Typography, Button, CircularProgress, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useVentaPOS } from "../hooks/pos/useVentaPOS";
import ProductSidebar      from "../components/POSVentaComponents/ProductSidebar";
import CartPanel           from "../components/POSVentaComponents/CartPanel";
import CheckoutPanel       from "../components/POSVentaComponents/CheckoutPanel";
import DialogAbrirCaja     from "../components/POSVentaComponents/DialogAbrirCaja";
import DialogCerrarCaja    from "../components/POSVentaComponents/DialogCerrarCaja";
import DialogReporteCierre from "../components/POSVentaComponents/DialogReporteCierre";
import DialogMovimientoCaja from "../components/POSVentaComponents/DialogMovimientoCaja";
import { useTheme }        from "@mui/material/styles";
import { posStyles as sx } from "../styles/pos/stylesPOS";
import PaymentsIcon        from "@mui/icons-material/Payments";
import LockIcon            from "@mui/icons-material/Lock";

// ── Reloj en tiempo real ─────────────────────────────────────────────
function LiveClock() {
  const theme = useTheme();
  const [time, setTime] = useState(new Date().toLocaleTimeString("es-CO"));
  useEffect(() => {
    const id = setInterval(
      () => setTime(new Date().toLocaleTimeString("es-CO")), 1000
    );
    return () => clearInterval(id);
  }, []);
  return <Box sx={sx.clockBadge(theme)}>{time}</Box>;
}

// ── Loading state ────────────────────────────────────────────────────
function POSLoadingSkeleton() {
  return (
    <Box sx={{ p: 1.5, height: "calc(100vh - 64px)", display: "grid",
      gridTemplateColumns: "300px 1fr 340px", gap: 1.5, backgroundColor: "grey.100" }}>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} variant="rounded" height="100%"
          sx={{ borderRadius: 2.5, transform: "none" }} />
      ))}
    </Box>
  );
}

export default function VentaPOS() {
  const theme = useTheme();
  const {
    productos, clientes,
    items, clienteSeleccionado, setClienteSeleccionado,
    metodoPago, setMetodoPago,
    montoRecibido, setMontoRecibido,
    observaciones, setObservaciones,
    cajaActiva, fetchCajaActiva, loadingCaja,
    openCajaModal, openCerrarCaja, setOpenCerrarCaja, 
    reporteCierre, openMovimiento, setOpenMovimiento,
    addItem, updateQuantity, removeItem, clearCart, loadProductos,
    handleAbrirCaja, handleCerrarCaja, handleCierreReporteClose, 
  } = useVentaPOS();

  // ── Loading state ────────────────────────────────────────────────
  if (loadingCaja) {
    return (
      <>
        <Box sx={sx.header(theme)}>
          <Skeleton width={200} height={40} />
          <Skeleton width={280} height={40} />
        </Box>
        <POSLoadingSkeleton />
      </>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <Box sx={sx.header(theme)}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            Punto de Venta
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {cajaActiva
              ? `Caja #${cajaActiva.idCaja} · ${cajaActiva.nombreCajero}`
              : "Sin caja activa — contacta al administrador"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <LiveClock />
          <Button
            variant="outlined"
            size="small"
            startIcon={<PaymentsIcon />}
            onClick={() => setOpenMovimiento(true)}
            disabled={!cajaActiva}
          >
            Movimiento
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<LockIcon />}
            onClick={() => setOpenCerrarCaja(true)}
            disabled={!cajaActiva}
          >
            Cerrar Caja
          </Button>
        </Box>
      </Box>

      {/* ── Grid principal ── */}
      <Box
        sx={{
          ...sx.grid,
          // ✅ Overlay visual cuando no hay caja — sin bloquear el DOM
          opacity: cajaActiva ? 1 : 0.45,
          pointerEvents: cajaActiva ? "auto" : "none",
        }}
      >
        <ProductSidebar productos={productos} onAdd={addItem} />
        <CartPanel items={items} onChangeQty={updateQuantity} onRemove={removeItem} />
        <CheckoutPanel
          clientes={clientes}
          items={items}
          clienteSeleccionado={clienteSeleccionado}
          setClienteSeleccionado={setClienteSeleccionado}
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          montoRecibido={montoRecibido}
          setMontoRecibido={setMontoRecibido}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          clearCart={clearCart}
          reloadProductos={loadProductos}
          cajaActiva={cajaActiva}
          fetchCajaActiva={fetchCajaActiva}
        />

        <DialogMovimientoCaja
          open={openMovimiento}
          onClose={() => setOpenMovimiento(false)}
          cajaActiva={cajaActiva}
        />
      </Box>

      {/* ── Dialogs ── */}
      <DialogAbrirCaja open={openCajaModal} onClose={() => {}} onConfirm={handleAbrirCaja} />
      <DialogCerrarCaja open={openCerrarCaja} onClose={() => setOpenCerrarCaja(false)}
        cajaActiva={cajaActiva} onConfirm={handleCerrarCaja} />
      <DialogReporteCierre open={!!reporteCierre} reporte={reporteCierre}
        onClose={handleCierreReporteClose} />
    </>
  );
}
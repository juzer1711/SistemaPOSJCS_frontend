import {
  Paper, Typography, Autocomplete, TextField,
  Button, Box, CircularProgress,
} from "@mui/material";
import PersonIcon        from "@mui/icons-material/Person";
import PaymentsIcon      from "@mui/icons-material/Payments";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useTheme }      from "@mui/material/styles";
import { useCheckout }   from "../../hooks/pos/useCheckout";
import CheckoutResumenDialog from "./CheckoutResumenDialog";
import { posStyles as sx }  from "../../styles/pos/stylesPOS";

const getClientName = (c) =>
  c?.razonSocial ?? `${c?.primerNombre ?? ""} ${c?.primerApellido ?? ""}`.trim();

const CheckoutPanel = ({
  clientes = [], items = [],
  clienteSeleccionado, setClienteSeleccionado,
  metodoPago, setMetodoPago,
  montoRecibido, setMontoRecibido,
  observaciones, setObservaciones,
  clearCart, reloadProductos, cajaActiva, fetchCajaActiva
}) => {
  const theme = useTheme();
  const {
    total, totalIVA, totalSinIVA, cambio,
    loadingVenta, openResumen, setOpenResumen, handleConfirm,
  } = useCheckout({
    items, clienteSeleccionado, metodoPago, montoRecibido, observaciones,
    setClienteSeleccionado, setMetodoPago, setMontoRecibido, setObservaciones,
    clearCart, reloadProductos, fetchCajaActiva,
  });

  const cambioPositivo = cambio >= 0;

  // ── Guard del botón cobrar ────────────────────────────────────────
  const canCheckout =
    clienteSeleccionado &&
    items.length > 0 &&
    metodoPago &&
    (metodoPago !== "EFECTIVO" || (montoRecibido && Number(montoRecibido) >= total));

  return (
    <Paper elevation={0} sx={sx.panel}>
      {/* Header */}
      <Box sx={sx.panelHeader}>
        <Typography variant="subtitle2" fontWeight={700}>Checkout</Typography>
        {cajaActiva && (
          <Typography variant="caption" color="text.secondary">
            Caja #{cajaActiva.idCaja}
          </Typography>
        )}
      </Box>

      {/* Contenido con scroll */}
      <Box sx={sx.scrollArea}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

          {/* ── Cliente ── */}
          <Box sx={sx.checkoutSection}>
            <Typography sx={sx.sectionLabel}>
              Cliente
            </Typography>
            <Autocomplete
              options={clientes}
              value={clienteSeleccionado}
              isOptionEqualToValue={(o, v) => o.idCliente === v?.idCliente}
              onChange={(_, val) => setClienteSeleccionado(val)}
              getOptionLabel={(c) => `${getClientName(c)} | ${c?.documento ?? ""}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Buscar cliente..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <PersonIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>

          {/* ── Método de pago ── */}
          <Box sx={sx.checkoutSection}>
            <Typography sx={sx.sectionLabel}>Método de pago</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { value: "EFECTIVO",      label: "Efectivo",      icon: <PaymentsIcon fontSize="small" /> },
                { value: "TRANSFERENCIA", label: "Transferencia", icon: <AccountBalanceIcon fontSize="small" /> },
              ].map(({ value, label, icon }) => (
                <Button
                  key={value}
                  fullWidth
                  variant={metodoPago === value ? "contained" : "outlined"}
                  color={metodoPago === value ? "primary" : "inherit"}
                  size="small"
                  startIcon={icon}
                  onClick={() => setMetodoPago(value)}
                  sx={{ py: 1, fontWeight: metodoPago === value ? 700 : 400 }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            {/* Monto recibido + cambio */}
            {metodoPago === "EFECTIVO" && (
              <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                  fullWidth size="small"
                  label="Monto recibido"
                  type="number"
                  value={montoRecibido}
                  onChange={(e) => setMontoRecibido(e.target.value)}
                />
                {montoRecibido && (
                  <Box sx={sx.cambioBadge(cambioPositivo)}>
                    <Typography variant="caption" fontWeight={700}
                      color={cambioPositivo ? "success.dark" : "warning.dark"}>
                      {cambioPositivo ? "Cambio" : "Falta"}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={800}
                      color={cambioPositivo ? "success.dark" : "warning.dark"}>
                      ${Math.abs(cambio).toLocaleString("es-CO")}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* ── Resumen de totales ── */}
          <Box sx={sx.checkoutSection}>
            <Typography sx={sx.sectionLabel}>Resumen</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">Subtotal sin IVA</Typography>
                <Typography variant="caption" fontWeight={600}>
                  ${totalSinIVA?.toLocaleString("es-CO") ?? "0"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">IVA</Typography>
                <Typography variant="caption" fontWeight={600}>
                  ${totalIVA?.toLocaleString("es-CO") ?? "0"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between",
                mt: 1, pt: 1, borderTop: "2px solid", borderColor: "primary.light" }}>
                <Typography variant="subtitle2" fontWeight={700}>Total</Typography>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  ${total.toLocaleString("es-CO")}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Observaciones ── */}
          <Box sx={sx.checkoutSection}>
            <Typography sx={sx.sectionLabel}>Observaciones</Typography>
            <TextField
              fullWidth multiline minRows={2} size="small"
              placeholder="Nota opcional para la venta..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </Box>

        </Box>
      </Box>

      {/* ── Botón cobrar fijo abajo ── */}
      <Box sx={{ px: 1.5, py: 1.5, borderTop: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          size="large"
          disabled={!canCheckout || loadingVenta}
          onClick={() => setOpenResumen(true)}
          sx={sx.cobrarBtn}
          startIcon={loadingVenta
            ? <CircularProgress size={18} color="inherit" />
            : null}
        >
          {loadingVenta
            ? "Procesando..."
            : canCheckout
              ? `Cobrar $${total.toLocaleString("es-CO")}`
              : "Completa los datos para cobrar"}
        </Button>
      </Box>

      <CheckoutResumenDialog
        open={openResumen}
        onClose={() => setOpenResumen(false)}
        cliente={clienteSeleccionado}
        metodoPago={metodoPago}
        observaciones={observaciones}
        items={items}
        total={total}
        totalIVA={totalIVA}
        totalSinIVA={totalSinIVA}
        montoRecibido={montoRecibido}
        cambio={cambio}
        loadingVenta={loadingVenta}
        onConfirm={handleConfirm}
      />
    </Paper>
  );
};

export default CheckoutPanel;
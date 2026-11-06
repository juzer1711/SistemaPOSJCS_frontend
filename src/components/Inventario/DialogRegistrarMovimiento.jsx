import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, Box, Typography,
  Autocomplete, CircularProgress,
} from "@mui/material";
import {
  ArrowDownward as EntradaIcon,
  ArrowUpward   as SalidaIcon,
} from "@mui/icons-material";

import { createFilterOptions } from "@mui/material";

const TIPOS = [
  {
    value: "ENTRADA", label: "Entrada", icon: EntradaIcon,
    colorBg: "#f1f8f1", colorBorder: "#a5d6a7", colorText: "#2e7d32",
  },
  {
    value: "SALIDA", label: "Salida", icon: SalidaIcon,
    colorBg: "#fff5f5", colorBorder: "#ef9a9a", colorText: "#c62828",
  },
];

export default function DialogRegistrarMovimiento({
  open,
  onClose,
  productos,
  // ── Estos vienen del hook via la página ──
  productoSeleccionado, setProductoSeleccionado,
  tipoMovimiento,       setTipoMovimiento,
  cantidad,             setCantidad,
  motivo,               setMotivo,
  loadingMovimiento,
  handleRegistrarMovimiento,
}) {
  const tipoConfig    = TIPOS.find((t) => t.value === tipoMovimiento);
  const stockActual   = productoSeleccionado?.stockActual ?? null;
  const cantidadNum   = Number(cantidad) || 0;
  const stockResultante = stockActual !== null
    ? tipoMovimiento === "ENTRADA"
      ? stockActual + cantidadNum
      : stockActual - cantidadNum
    : null;
  const filtrarProductos = createFilterOptions({
    stringify: (p) => `${p.nombre} ${p.codigoBarras ?? ""}`, // busca en nombre Y código
    });
  // ── Cierra y limpia ──────────────────────────────────────────────
  const handleClose = () => {
    setProductoSeleccionado(null);
    setCantidad("");
    setMotivo("");
    setTipoMovimiento("ENTRADA");
    onClose();
  };

  // ── Submit: llama al handler del hook y cierra si éxito ──────────
  const handleSubmit = async () => {
    await handleRegistrarMovimiento();
    // El hook maneja el snackbar; si no lanza error, cerramos
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* ── Header ── */}
      <Box sx={{
        px: 3, py: 2,
        borderBottom: "1px solid", borderColor: "divider",
      }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Registrar movimiento de inventario
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Ajusta manualmente el stock de un producto
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

          {/* Producto */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.8}>
              Producto *
            </Typography>
            <Autocomplete
              size="small"
              fullWidth
              options={productos}
              filterOptions={filtrarProductos} 
              getOptionLabel={(p) => `${p.nombre} | Stock: ${p.stockActual}`}
              value={productoSeleccionado}
              onChange={(_, val) => setProductoSeleccionado(val)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Buscar producto..." />
              )}
            />
          </Box>

          {/* Tipo */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.8}>
              Tipo de movimiento *
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {TIPOS.map(({ value, label, icon: Icon, colorBg, colorBorder, colorText }) => {
                const active = tipoMovimiento === value;
                return (
                  <Box
                    key={value}
                    onClick={() => setTipoMovimiento(value)}
                    sx={{
                      flex: 1,
                      borderRadius: 2.5,
                      border: "2px solid",
                      borderColor: active ? colorBorder : "divider",
                      backgroundColor: active ? colorBg : "background.paper",
                      opacity: active ? 1 : 0.5,
                      cursor: "pointer",
                      p: 1.5,
                      textAlign: "center",
                      transition: "all 0.15s ease",
                      "&:hover": { opacity: 1, borderColor: colorBorder },
                    }}
                  >
                    <Icon sx={{ fontSize: 26, color: active ? colorText : "text.disabled" }} />
                    <Typography variant="caption" display="block"
                      fontWeight={700} color={active ? colorText : "text.secondary"}>
                      {label}
                    </Typography>
                    <Typography variant="caption" display="block"
                      color="text.disabled" fontSize="0.65rem">
                      {value === "ENTRADA" ? "Ingreso de stock" : "Retiro de stock"}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Cantidad */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.8}>
              Cantidad *
            </Typography>
            <TextField
              size="small"
              fullWidth
              type="number"
              placeholder="0"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              inputProps={{ min: 1 }}
            />
            {/* Preview stock resultante */}
            {stockActual !== null && cantidadNum > 0 && (
              <Box sx={{
                mt: 1,
                px: 1.5, py: 0.8,
                borderRadius: 1.5,
                backgroundColor: tipoMovimiento === "ENTRADA" ? "#e8f5e9" : "#ffebee",
                border: "1px solid",
                borderColor: tipoMovimiento === "ENTRADA" ? "success.light" : "error.light",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <Typography variant="caption" color="text.secondary">
                  Stock actual: <strong>{stockActual}</strong>
                </Typography>
                <Typography variant="caption" fontWeight={700}
                  color={tipoMovimiento === "ENTRADA" ? "success.dark" : "error.dark"}>
                  → quedará en <strong>{stockResultante}</strong>
                </Typography>
              </Box>
            )}
          </Box>

          {/* Motivo */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.8}>
              Motivo *
            </Typography>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={2}
              placeholder="Describe el motivo del movimiento..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </Box>

        </Box>
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions sx={{
        px: 3, py: 2,
        borderTop: "1px solid", borderColor: "divider",
        gap: 1,
      }}>
        <Button onClick={handleClose} disabled={loadingMovimiento}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color={tipoMovimiento === "ENTRADA" ? "success" : "error"}
          disabled={loadingMovimiento || !productoSeleccionado || !cantidad || !motivo}
          onClick={handleSubmit}
          startIcon={
            loadingMovimiento
              ? <CircularProgress size={16} color="inherit" />
              : tipoConfig ? <tipoConfig.icon /> : null
          }
          sx={{ fontWeight: 700 }}
        >
          {loadingMovimiento
            ? "Registrando..."
            : `Registrar ${tipoConfig?.label ?? ""}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
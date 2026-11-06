import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, Box, Typography,
  CircularProgress,
} from "@mui/material";
import {
  ArrowDownward as EntradaIcon,
  ArrowUpward  as SalidaIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { registrarMovimientoCaja } from "../../services/movimientosCajaService";
import { useSnackbar } from "../../context/SnackBarProvider";

// ── Config visual por tipo ────────────────────────────────────────────
const TIPOS = [
  {
    value:      "ENTRADA",
    label:      "Entrada",
    icon:       EntradaIcon,
    desc:       "Ingreso de efectivo a la caja",
    colorBg:    "#f1f8f1",
    colorBorder:"#a5d6a7",
    colorText:  "#2e7d32",
    colorBtn:   "success",
    preview:    "💵 Ingresando al efectivo",
  },
  {
    value:      "SALIDA",
    label:      "Salida",
    icon:       SalidaIcon,
    desc:       "Retiro de efectivo de la caja",
    colorBg:    "#fff5f5",
    colorBorder:"#ef9a9a",
    colorText:  "#c62828",
    colorBtn:   "error",
    preview:    "📤 Retirando del efectivo",
  },
];

// ── Formateador colombiano ────────────────────────────────────────────
const fmt = (n) => Number(n || 0).toLocaleString("es-CO");

export default function DialogMovimientoCaja({ open, onClose, cajaActiva }) {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar(); // ✅ provider global

  const [tipo,   setTipo]   = useState("ENTRADA");
  const [monto,  setMonto]  = useState("");
  const [motivo, setMotivo] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const tipoConfig = TIPOS.find((t) => t.value === tipo);

  // ── Reset al cerrar ───────────────────────────────────────────────
  const handleClose = () => {
    setMonto("");
    setMotivo("");
    setErrors({});
    setTipo("ENTRADA");
    onClose();
  };

  // ── Validación local ──────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!monto || Number(monto) <= 0)
      e.monto = "El monto debe ser mayor a $0";
    if (!motivo.trim())
      e.motivo = "El motivo es obligatorio";
    if (motivo.trim().length < 5)
      e.motivo = "Describe el motivo con más detalle";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleGuardar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await registrarMovimientoCaja({
        idCaja:    cajaActiva.idCaja,
        idUsuario: localStorage.getItem("id_usuario"),
        tipo,
        monto:     Number(monto),
        motivo:    motivo.trim(),
      });

      showSnackbar(
        `${tipo === "ENTRADA" ? "Entrada" : "Salida"} de $${fmt(monto)} registrada correctamente`,
        "success"
      );
      handleClose();
    } catch (e) {
      const msg = e.response?.data?.message || "Error al registrar el movimiento";
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          px: 3, py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          💰 Movimiento de Caja
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Caja #{cajaActiva?.idCaja} · {cajaActiva?.nombreCajero}
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          {/* ── Tipo: botones visuales ── */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={1}>
              Tipo de movimiento
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.2 }}>
              {TIPOS.map(({ value, label, icon: Icon, desc, colorBg, colorBorder, colorText }) => {
                const active = tipo === value;
                return (
                  <Box
                    key={value}
                    onClick={() => {
                      setTipo(value);
                      setErrors((p) => ({ ...p }));
                    }}
                    sx={{
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
                    <Icon sx={{ fontSize: 28, color: active ? colorText : "text.disabled" }} />
                    <Typography variant="caption" display="block"
                      fontWeight={700} color={active ? colorText : "text.secondary"}>
                      {label}
                    </Typography>
                    <Typography variant="caption" display="block"
                      color="text.disabled" fontSize="0.65rem" lineHeight={1.3}>
                      {desc}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* ── Monto ── */}
          <Box>
            <TextField
              label="Monto *"
              type="number"
              fullWidth
              value={monto}
              onChange={(e) => {
                setMonto(e.target.value);
                if (errors.monto) setErrors((p) => ({ ...p, monto: "" }));
              }}
              error={!!errors.monto}
              helperText={errors.monto || " "}
              inputProps={{ min: 1 }}
            />

            {/* Preview del monto */}
            {monto && Number(monto) > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 1.5, py: 1,
                  mt: -1.5,
                  borderRadius: 2,
                  backgroundColor: tipoConfig.colorBg,
                  border: "1px solid",
                  borderColor: tipoConfig.colorBorder,
                }}
              >
                <Typography variant="caption" fontWeight={600}
                  color={tipoConfig.colorText}>
                  {tipoConfig.preview}
                </Typography>
                <Typography variant="subtitle2" fontWeight={800}
                  color={tipoConfig.colorText}>
                  ${fmt(monto)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* ── Motivo ── */}
          <TextField
            label="Motivo *"
            multiline
            rows={3}
            fullWidth
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              if (errors.motivo) setErrors((p) => ({ ...p, motivo: "" }));
            }}
            error={!!errors.motivo}
            helperText={errors.motivo || " "}
            placeholder="Describe el motivo del movimiento..."
          />

        </Box>
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions
        sx={{
          px: 3, py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          gap: 1,
        }}
      >
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color={tipoConfig.colorBtn}
          disabled={loading}
          onClick={handleGuardar}
          startIcon={
            loading
              ? <CircularProgress size={16} color="inherit" />
              : <tipoConfig.icon />
          }
          sx={{ fontWeight: 700 }}
        >
          {loading
            ? "Registrando..."
            : `Registrar ${tipoConfig.label}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
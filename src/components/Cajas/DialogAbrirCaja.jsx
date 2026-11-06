import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, Box, Typography,
  Autocomplete, CircularProgress, Alert,
} from "@mui/material";
import {
  LockOpen as LockOpenIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

export default function DialogAbrirCaja({
  open,
  onClose,
  // Del hook via página
  usuarios,
  form,
  setForm,
  errores,
  setErrores,
  saving,
  loadingUsuarios,
  setBusquedaUsuario,
  handleAbrirCaja,
}) {
  const handleClose = () => {
    if (saving) return;
    onClose();
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
          🏧 Abrir Caja
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Asigna un cajero y define el monto inicial de efectivo
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

          {/* Banner informativo */}
          <Box sx={{
            display: "flex", gap: 1.5, p: 1.5,
            backgroundColor: "primary.50",
            border: "1px solid", borderColor: "primary.light",
            borderRadius: 2,
          }}>
            <InfoIcon sx={{ color: "primary.main", fontSize: 20, flexShrink: 0, mt: 0.2 }} />
            <Typography variant="caption" color="primary.dark" lineHeight={1.6}>
              El <strong>monto inicial</strong> representa el efectivo físico disponible al
              comenzar el turno. Será la referencia para el cuadre al momento del cierre.
            </Typography>
          </Box>

          {/* Cajero */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.8}>
              Cajero *
            </Typography>
            <Autocomplete
              fullWidth
              options={usuarios}
              value={form.usuario}
              loading={loadingUsuarios}
              onChange={(_, val) => {
                setForm({ ...form, usuario: val });
                setErrores({ ...errores, usuario: undefined });
              }}
              onInputChange={(_, val) => setBusquedaUsuario(val)}
              getOptionLabel={(u) =>
                u ? `${u.primerNombre} ${u.primerApellido} — ${u.documento}` : ""
              }
              isOptionEqualToValue={(opt, val) => opt.idUsuario === val?.idUsuario}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Buscar cajero por nombre o documento..."
                  error={!!errores.usuario}
                  helperText={errores.usuario || " "}
                />
              )}
            />
          </Box>

          {/* Monto inicial */}
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.disabled"
              textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.8}>
              Monto inicial *
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="$ 0"
              value={form.montoInicial}
              onChange={(e) => {
                setForm({ ...form, montoInicial: e.target.value });
                setErrores({ ...errores, montoInicial: undefined });
              }}
              error={!!errores.montoInicial}
              helperText={errores.montoInicial || " "}
              inputProps={{ min: 0 }}
            />
            {/* Preview formateado */}
            {form.montoInicial && Number(form.montoInicial) > 0 && (
              <Box sx={{
                mt: -1, px: 1.5, py: 0.8, borderRadius: 1.5,
                backgroundColor: "#e8f5e9",
                border: "1px solid", borderColor: "success.light",
                display: "flex", justifyContent: "space-between",
              }}>
                <Typography variant="caption" color="success.dark">
                  Efectivo en caja al abrir
                </Typography>
                <Typography variant="caption" fontWeight={800} color="success.dark">
                  ${Number(form.montoInicial).toLocaleString("es-CO")}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Error general */}
          {errores.general && (
            <Alert severity="error" variant="outlined">
              {errores.general}
            </Alert>
          )}

        </Box>
      </DialogContent>

      <DialogActions sx={{
        px: 3, py: 2,
        borderTop: "1px solid", borderColor: "divider", gap: 1,
      }}>
        <Button onClick={handleClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={saving}
          onClick={handleAbrirCaja}
          startIcon={
            saving
              ? <CircularProgress size={16} color="inherit" />
              : <LockOpenIcon />
          }
          sx={{ fontWeight: 700 }}
        >
          {saving ? "Abriendo..." : "Abrir Caja"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
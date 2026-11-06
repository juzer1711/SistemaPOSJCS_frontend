import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Grid,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import { getAccionColor } from "../../utils/auditoriaColors";

import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";

import { format } from "date-fns";

export default function AuditoriaDetailDialog({ open, onClose, auditoria }) {
  if (!auditoria) return null;

  const fechaFormateada = auditoria.fecha
    ? format(new Date(auditoria.fecha), "dd/MM/yyyy HH:mm:ss")
    : "-";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          background: "linear-gradient(135deg, #1565c0, #1976d2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <HistoryIcon sx={{ color: "white" }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="white">
              Registro de Auditoría
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
              ID #{auditoria.id}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>

        {/* FECHA + USUARIO */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            INFORMACIÓN GENERAL
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Fecha
                </Typography>
                <Typography fontWeight={600}>{fechaFormateada}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Usuario
                </Typography>
                <Typography fontWeight={600}>
                  {auditoria.usuario?.username || "-"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Box
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Nombre completo
                </Typography>
                <Typography fontWeight={600}>
                  {auditoria.usuario?.nombreCompleto || "-"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* MODULO + ACCION */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            ACCIÓN REALIZADA
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Módulo
                </Typography>
                <Typography fontWeight={600}>
                  {auditoria.modulo}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  display: "flex",   
                  flexDirection: "column", 
                  alignItems: "flex-start" 
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Acción 
                </Typography>

                <Chip
                  label={auditoria.accion?.replaceAll("_", " ")}
                  color={getAccionColor(auditoria.accion)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* DESCRIPCION */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            DESCRIPCIÓN
          </Typography>

          <Box
            sx={{
              mt: 1,
              p: 2,
              borderRadius: 2,
              backgroundColor: "background.default",
              border: "1px solid",
              borderColor: "divider",
              whiteSpace: "pre-wrap",
            }}
          >
            <Typography variant="body2">
              {auditoria.descripcion}
            </Typography>
          </Box>
        </Box>

      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
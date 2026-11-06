import {
  Box, Card, CardContent, Typography, Grid,
  TextField, Button, Alert, CircularProgress,
  Avatar, IconButton, Tooltip,
} from "@mui/material";
import { Save, PhotoCamera, Business } from "@mui/icons-material";
import { useRef } from "react";
import { styles } from "../styles/empresa/stylesEmpresaProfile";
import { useEmpresaProfile } from "../hooks/empresa/useEmpresaProfile";

export default function EmpresaProfile() {

  const fileInputRef = useRef(null);

  const {
    empresa,
    loading,
    saving,
    uploadingLogo,
    mensaje,
    mensajeSeverity,
    fieldErrors,
    handleChange,
    handleSave,
    handleLogoChange,
  } = useEmpresaProfile();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.root}>
      <Card sx={styles.card}>
        <CardContent sx={styles.cardContent}>

          <Typography variant="h4" sx={styles.header}>
            Perfil de Empresa
          </Typography>

          {/* ── Logo ── */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ position: "relative" }}>

              {uploadingLogo ? (
                <Box sx={{
                  width: 110, height: 110,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed",
                  borderColor: "primary.main",
                }}>
                  <CircularProgress size={36} />
                </Box>
              ) : (
                <Avatar
                  src={empresa?.logo || undefined}
                  sx={{
                    width: 110, height: 110,
                    border: "3px solid",
                    borderColor: "primary.main",
                    bgcolor: "grey.100",
                  }}
                >
                  <Business sx={{ fontSize: 55, color: "grey.400" }} />
                </Avatar>
              )}

              <Tooltip title="Cambiar logo">
                <IconButton
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploadingLogo}
                  sx={{
                    position: "absolute",
                    bottom: 0, right: 0,
                    bgcolor: "primary.main",
                    color: "white",
                    width: 32, height: 32,
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <PhotoCamera sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />

            </Box>
          </Box>

          {/* ── Alerta ── */}
          {mensaje && (
            <Alert severity={mensajeSeverity} sx={{ mb: 3 }}>
              {mensaje}
            </Alert>
          )}

          {/* ── Campos ── */}
          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Nombre Comercial" name="nombreComercial"
                value={empresa?.nombreComercial || ""} onChange={handleChange}
                error={!!fieldErrors.nombreComercial}
                helperText={fieldErrors.nombreComercial || " "} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Razón Social" name="razonSocial"
                value={empresa?.razonSocial || ""} onChange={handleChange}
                error={!!fieldErrors.razonSocial}
                helperText={fieldErrors.razonSocial || " "} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="NIT" name="nit"
                value={empresa?.nit || ""} onChange={handleChange}
                error={!!fieldErrors.nit}
                helperText={fieldErrors.nit || " "} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Teléfono" name="telefono"
                value={empresa?.telefono || ""} onChange={handleChange}
                error={!!fieldErrors.telefono}
                helperText={fieldErrors.telefono || " "} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Dirección" name="direccion"
                value={empresa?.direccion || ""} onChange={handleChange}
                error={!!fieldErrors.direccion}
                helperText={fieldErrors.direccion || " "} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Correo" name="correo"
                value={empresa?.correo || ""} onChange={handleChange}
                error={!!fieldErrors.correo}
                helperText={fieldErrors.correo || " "} />
            </Grid>

          </Grid>

          <Box sx={styles.buttonContainer}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
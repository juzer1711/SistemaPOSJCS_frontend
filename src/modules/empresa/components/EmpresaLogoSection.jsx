import { useRef } from "react";
import { Alert, Avatar, Button, CircularProgress, Typography } from "@mui/material";
import { BusinessOutlined, PhotoCameraOutlined } from "@mui/icons-material";
import styles from "../pages/EmpresaProfilePage.module.css";

export default function EmpresaLogoSection({ empresa, canUpdate, busy, uploading, error, onChange }) {
  const inputRef = useRef(null);
  return (
    <section className={styles.logoSection} aria-labelledby="empresa-logo-title" aria-busy={uploading}>
      <Avatar src={empresa.logo || undefined} alt={`Logo de ${empresa.nombreComercial}`}
        variant="rounded" className={styles.logo}>
        <BusinessOutlined fontSize="large" />
      </Avatar>
      <div className={styles.logoContent}>
        <Typography component="h2" variant="h6" id="empresa-logo-title">Logo de la empresa</Typography>
        <p id="empresa-logo-help" className={styles.description}>
          PNG o JPEG, hasta 2 MB. Máximo 4096 píxeles por lado y 16 millones de píxeles en total.
          {canUpdate && " El logo se guarda al seleccionar el archivo, por separado de los datos."}
        </p>
        {canUpdate && <>
          <Button type="button" variant="outlined" disabled={busy} onClick={() => inputRef.current?.click()}
            aria-describedby="empresa-logo-help"
            startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <PhotoCameraOutlined />}>
            {uploading ? "Subiendo logo…" : "Cambiar logo"}
          </Button>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg" hidden
            aria-label="Seleccionar logo de empresa" disabled={busy} onChange={onChange} />
        </>}
        {error && <Alert severity="error" className={styles.notice}>{error}</Alert>}
      </div>
    </section>
  );
}

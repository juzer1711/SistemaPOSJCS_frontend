import { useEffect, useState } from "react";
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { obtenerModulo } from "../services/modulosApi.js";
import styles from "./ModuloInfoDialog.module.css";

export default function ModuloInfoDialog({ idModulo, onClose }) {
  const [modulo, setModulo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setModulo(null);
    setError("");
    // GET /modulos/{id}: backend enforces MODULOS / CONSULTA on every opening.
    obtenerModulo(idModulo, { signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setModulo(data); })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.response?.data?.message || "No fue posible consultar el módulo.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [idModulo, attempt]);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="modulo-info-title">
      <DialogTitle id="modulo-info-title">Información del módulo</DialogTitle>
      <DialogContent className={styles.content} aria-busy={loading}>
        {loading && <CircularProgress size={28} aria-label="Consultando módulo" />}
        {error && <Alert severity="error" action={<Button onClick={() => setAttempt((value) => value + 1)}>Reintentar</Button>}>{error}</Alert>}
        {modulo && (
          <dl className={styles.details}>
            <dt>Nombre</dt><dd>{modulo.nombreModulo}</dd>
            <dt>Código</dt><dd>{modulo.codigoModulo}</dd>
            <dt>Zona</dt><dd>{modulo.zona}</dd>
            <dt>Archivo</dt><dd>{modulo.archivo}</dd>
            <dt>Descripción / comentarios</dt><dd>{modulo.comentarios || "Sin descripción / comentarios."}</dd>
          </dl>
        )}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Cerrar</Button></DialogActions>
    </Dialog>
  );
}
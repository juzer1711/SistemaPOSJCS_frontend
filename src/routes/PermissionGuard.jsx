import { Alert, Button, CircularProgress } from "@mui/material";
import { usePermissions } from "../context/PermissionsContext.jsx";

export default function PermissionGuard({ modulo, children }) {
  const { can, status, error, refreshPermissions } = usePermissions();
  if (status === "loading" || status === "idle") return <CircularProgress aria-label="Consultando permisos" />;
  if (status === "error") return (
    <Alert severity="error" action={<Button onClick={refreshPermissions}>Reintentar</Button>}>{error}</Alert>
  );
  if (!can(modulo, "CONSULTA")) return <Alert severity="warning">No tienes permiso de consulta para este módulo.</Alert>;
  return children;
}
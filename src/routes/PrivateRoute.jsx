import React from "react";
import { Navigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import PermissionGuard from "./PermissionGuard.jsx";
import AppLayout from "../modules/layout/components/AppLayout.jsx";

const PrivateRoute = ({ children, modulo }) => {
  const { status, refreshSession } = useAuth();

  if (status === "checking") {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;
  }
  if (status === "unauthenticated") return <Navigate to="/login" replace />;
  if (status === "error") {
    return (
      <Alert
        severity="error"
        action={<Button color="inherit" size="small" onClick={() => refreshSession()}>Reintentar</Button>}
      >
        No se pudo verificar la sesión. Comprueba tu conexión e inténtalo nuevamente.
      </Alert>
    );
  }

  return (
    <AppLayout>
      {modulo ? <PermissionGuard modulo={modulo}>{children}</PermissionGuard> : children}
    </AppLayout>
  );
};
export default PrivateRoute;

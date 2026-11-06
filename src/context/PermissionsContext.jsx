import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { consultarPermisosPropios } from "../modules/reglas/services/reglasApi.js";

const PermissionsContext = createContext(null);
const FIELDS = {
  CONSULTA: "reglaConsulta", INSERCION: "reglaInsercion", ACTUALIZACION: "reglaActualizacion",
  REPORTE: "reglaReporte", DELETE: "reglaDelete",
};

export function PermissionsProvider({ children }) {
  const { user, status: authStatus } = useAuth();
  const userId = user?.idUsuario;
  const controllerRef = useRef(null);
  const [state, setState] = useState({ userId: null, status: "idle", permissions: {}, error: "" });

  const refreshPermissions = useCallback(async () => {
    controllerRef.current?.abort();
    if (authStatus !== "authenticated" || userId == null) {
      setState({ userId: null, status: "idle", permissions: {}, error: "" });
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    setState((current) => current.userId === userId && current.status === "ready" ? current
      : { userId, status: "loading", permissions: {}, error: "" });
    try {
      const response = await consultarPermisosPropios({ signal: controller.signal });
      if (!controller.signal.aborted) setState({
        userId, status: "ready", error: "",
        permissions: Object.fromEntries(response.map((entry) => [entry.codigoModulo, entry])),
      });
    } catch (error) {
      if (!controller.signal.aborted) setState({
        userId, status: "error", permissions: {},
        error: error.response?.data?.message || "No fue posible consultar tus permisos.",
      });
    }
  }, [authStatus, userId]);

  useEffect(() => {
    refreshPermissions();
    const refresh = () => { refreshPermissions(); };
    globalThis.addEventListener("focus", refresh);
    globalThis.addEventListener("permissions:forbidden", refresh);
    return () => {
      controllerRef.current?.abort();
      globalThis.removeEventListener("focus", refresh);
      globalThis.removeEventListener("permissions:forbidden", refresh);
    };
  }, [refreshPermissions]);

  const ready = authStatus === "authenticated" && state.userId === userId && state.status === "ready";
  const can = useCallback((modulo, accion = "CONSULTA") =>
    ready && state.permissions[modulo]?.[FIELDS[accion]] === true, [ready, state.permissions]);
  const value = useMemo(() => ({
    can, refreshPermissions,
    status: authStatus === "authenticated" && state.userId !== userId ? "loading" : state.status,
    error: state.error,
  }), [can, refreshPermissions, authStatus, userId, state]);
  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) throw new Error("usePermissions requiere PermissionsProvider");
  return context;
}
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { usePermissions } from "../../../context/PermissionsContext.jsx";
import { useSnackbar } from "../../../context/SnackBarProvider.jsx";
import { cambiarPermiso, listarMatriz } from "../services/reglasApi.js";

export const PERMISSION_COLUMNS = [
  { field: "reglaConsulta", accion: "CONSULTA", headerName: "Consultar" },
  { field: "reglaInsercion", accion: "INSERCION", headerName: "Insertar" },
  { field: "reglaActualizacion", accion: "ACTUALIZACION", headerName: "Actualizar" },
  { field: "reglaReporte", accion: "REPORTE", headerName: "Reportar" },
  { field: "reglaDelete", accion: "DELETE", headerName: "Eliminar" },
];

export default function useMatrizPermisos() {
  const { user } = useAuth();
  const { can, refreshPermissions } = usePermissions();
  const { showSnackbar } = useSnackbar();
  const [usuario, setUsuario] = useState(() => ({ idUsuario: user.idUsuario, username: user.username }));
  const [modulo, setModulo] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [pending, setPending] = useState(null);
  const pendingRef = useRef(false);
  const mounted = useRef(false);
  const usuarioId = usuario?.idUsuario;
  const moduloId = modulo?.idModulo;
  const canUpdate = can("REGLAS", "ACTUALIZACION");

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    setRows([]);
    setTotalRows(0);
    setError("");
    if (usuarioId == null) { setLoading(false); return; }
    const controller = new AbortController();
    setLoading(true);
    listarMatriz({ usuarioId, moduloId, page, size: pageSize, signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        setRows(response.content);
        setTotalRows(response.totalElements);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.response?.data?.message || "No fue posible consultar la matriz.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [usuarioId, moduloId, page, pageSize, attempt]);

  const toggle = useCallback(async (row, column) => {
    if (pendingRef.current || loading || !canUpdate || usuarioId == null) return;
    pendingRef.current = true;
    const previous = row[column.field];
    const next = !previous;
    setPending({ moduloId: row.moduloId, field: column.field });
    setRows((current) => current.map((item) => item.moduloId === row.moduloId ? { ...item, [column.field]: next } : item));
    try {
      await cambiarPermiso({ usuarioId, moduloId: row.moduloId, accion: column.accion, valor: next });
      if (usuarioId === user.idUsuario) await refreshPermissions();
      if (mounted.current) showSnackbar("Permiso actualizado.", "success");
    } catch (requestError) {
      if (mounted.current) {
        setRows((current) => current.map((item) => item.moduloId === row.moduloId ? { ...item, [column.field]: previous } : item));
        showSnackbar(requestError.response?.data?.message || "No fue posible guardar el permiso. Se restauró el valor anterior.", "error");
      }
    } finally {
      pendingRef.current = false;
      if (mounted.current) setPending(null);
    }
  }, [canUpdate, loading, usuarioId, user.idUsuario, refreshPermissions, showSnackbar]);

  return {
    usuario, modulo, page, pageSize, rows, totalRows, loading, error, pending, canUpdate, toggle,
    selectUsuario: (next) => { if (!pendingRef.current) { setUsuario(next); setPage(0); } },
    selectModulo: (next) => { if (!pendingRef.current) { setModulo(next); setPage(0); } },
    setPage: (next) => { if (!pendingRef.current) setPage(next); },
    setPageSize: (next) => { if (!pendingRef.current) { setPageSize(next); setPage(0); } },
    retry: () => setAttempt((current) => current + 1),
  };
}
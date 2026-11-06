import { useEffect, useRef, useState } from "react";
import useCrudQuery from "../../../components/ui/crud/useCrudQuery.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { usePermissions } from "../../../context/PermissionsContext.jsx";
import { useSnackbar } from "../../../context/SnackBarProvider.jsx";
import { useExport } from "../../../hooks/export/useExport.js";
import { listarUsuarios, listarTiposDocumento, crearUsuario, actualizarUsuario, cambiarEstadoUsuario,
  exportarUsuariosExcel, exportarUsuariosCSV } from "../services/usuariosApi.js";
import { usuarioPayload } from "../validation/usuarioFields.js";

const FILTERS = { search: "", estado: "true", tipoDocumento: "" };
const SORT = { field: "nombreCompleto", direction: "asc" };

export default function useUsuarios() {
  const query = useCrudQuery({ load: listarUsuarios, initialFilters: FILTERS, initialSort: SORT,
    errorMessage: "No fue posible consultar los usuarios." });
  const { user, logout } = useAuth();
  const { can } = usePermissions();
  const { showSnackbar } = useSnackbar();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [types, setTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState("");
  const [typesAttempt, setTypesAttempt] = useState(0);
  const [stateTarget, setStateTarget] = useState(null);
  const [statePending, setStatePending] = useState(false);
  const [stateError, setStateError] = useState("");
  const stateLock = useRef(false);
  const alive = useRef(false);
  const excel = useExport(exportarUsuariosExcel, "usuarios.xlsx");
  const csv = useExport(exportarUsuariosCSV, "usuarios.csv");
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    const controller = new AbortController();
    setTypesLoading(true); setTypesError("");
    listarTiposDocumento({ signal: controller.signal })
      .then((response) => { if (!controller.signal.aborted) setTypes(response); })
      .catch((error) => { if (!controller.signal.aborted) setTypesError(error.response?.data?.message || "No fue posible cargar los tipos de documento."); })
      .finally(() => { if (!controller.signal.aborted) setTypesLoading(false); });
    return () => controller.abort();
  }, [typesAttempt]);

  const closeForm = () => { setFormOpen(false); setSelectedUser(null); };
  const save = async (values) => {
    const editing = Boolean(selectedUser);
    if (!can("USUARIOS", editing ? "ACTUALIZACION" : "INSERCION")) throw new Error("No tienes permiso para guardar usuarios.");
    const payload = usuarioPayload(values);
    if (editing) await actualizarUsuario(selectedUser.idUsuario, payload);
    else await crearUsuario(payload);
    closeForm();
    if (editing && selectedUser.idUsuario === user.idUsuario && payload.username !== user.username) {
      showSnackbar("Tu usuario cambió. Inicia sesión nuevamente.", "info");
      await logout().catch(() => {});
      return;
    }
    showSnackbar(editing ? "Usuario actualizado correctamente." : "Usuario creado correctamente.", "success");
    query.refresh();
  };

  const confirmState = async () => {
    if (stateLock.current || !stateTarget || !can("USUARIOS", "ACTUALIZACION")) return;
    stateLock.current = true; setStatePending(true); setStateError("");
    try {
      const active = !stateTarget.estado;
      await cambiarEstadoUsuario(stateTarget.idUsuario, active);
      if (!active && stateTarget.idUsuario === user.idUsuario) {
        showSnackbar("Tu usuario fue desactivado. Se cerrará la sesión.", "info");
        await logout().catch(() => {});
        return;
      }
      if (alive.current) {
        setStateTarget(null); query.refresh();
        showSnackbar(active ? "Usuario activado correctamente." : "Usuario desactivado correctamente.", "success");
      }
    } catch (error) {
      if (alive.current) setStateError(error.response?.data?.message || "No fue posible cambiar el estado. Puedes reintentar.");
    } finally {
      stateLock.current = false;
      if (alive.current) setStatePending(false);
    }
  };

  const exportParams = () => ({ search: query.debouncedFilters.search.trim() || undefined,
    tipoDocumento: query.debouncedFilters.tipoDocumento || undefined,
    estado: query.debouncedFilters.estado === "" ? undefined : query.debouncedFilters.estado });
  return {
    ...query, types, typesLoading, typesError, formOpen, selectedUser, save, closeForm,
    stateTarget, statePending, stateError, confirmState, loadingExcel: excel.loadingExport, loadingCSV: csv.loadingExport,
    retryTypes: () => setTypesAttempt((current) => current + 1),
    openCreate: () => { setSelectedUser(null); setFormOpen(true); },
    openEdit: (row) => { setSelectedUser(row); setFormOpen(true); },
    askState: (row) => { setStateTarget(row); setStateError(""); },
    closeState: () => { if (!stateLock.current) setStateTarget(null); },
    exportExcel: () => { if (can("USUARIOS", "REPORTE")) excel.handleExport(exportParams()); },
    exportCSV: () => { if (can("USUARIOS", "REPORTE")) csv.handleExport(exportParams()); },
  };
}
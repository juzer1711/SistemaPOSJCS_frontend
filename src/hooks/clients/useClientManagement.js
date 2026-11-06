import { useEffect, useState } from "react";
import {
  searchClients,
  deactivateClient,
  activateClient
} from "../../services/clientService";
import { useExport } from "../export/useExport";
import { exportClientesExcel, exportClientesCSV } from "../../services/exportService";

export default function useClients() {
  const [clients, setClients] = useState([]);

  // PAGINACIÓN
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // filtros
  const [filter, setFilter] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const [sortBy, setSortBy] = useState({ key: "primerApellido", direction: "asc" });

  const [advancedFilters, setAdvancedFilters] = useState({
    tipoCliente: "",
    tipoDocumento: "",
    estado: ""
  });

  // UI
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // columnas
  const ALL_COLUMNS = {
    idCliente: "ID",
    tipoCliente: "Tipo Cliente",
    primerNombre: "Primer Nombre",
    segundoNombre: "Segundo Nombre",
    primerApellido: "Primer Apellido",
    segundoApellido: "Segundo Apellido",
    razonSocial: "Razón Social",
    tipoDocumento: "Tipo Documento",
    documento: "Documento",
    identificadorNit: "DV",
    direccion: "Dirección",
    email: "Email",
    telefono: "Teléfono",
    estado: "Estado",
    acciones: "Acciones",
  };

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaults = {};
    Object.keys(ALL_COLUMNS).forEach((k) => (defaults[k] = true));
    return defaults;
  });

  const { handleExport: handleExportExcel, loadingExport: loadingExcel } =
    useExport(exportClientesExcel, "clientes.xlsx");
  const { handleExport: handleExportCSV, loadingExport: loadingCSV } =
    useExport(exportClientesCSV, "clientes.csv");

  const handleShowAll = () => {
    const all = {};
    Object.keys(visibleColumns).forEach(k => all[k] = true);
    setVisibleColumns(all);
  };

  // CARGAR CLIENTES
  const loadClients = async () => {
    try {
      const params = {
        page,
        size: pageSize,
        sort: `${sortBy.key},${sortBy.direction}`,
        search: filter || undefined,
        tipoCliente: advancedFilters.tipoCliente || undefined,
        tipoDocumento: advancedFilters.tipoDocumento || undefined,
        estado: showInactive ? false : true
      };

      const res = await searchClients(params);

      setClients(res.data.content || []);
      setTotalRows(res.data.totalElements || 0);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadClients();
  }, [page, pageSize, sortBy, filter, advancedFilters, showInactive]);

  // AGREGAR
  const handleAdd = () => {
    setEditing(false);
    setSelectedClient(null);
    setOpen(true);
  };

  // EDITAR
  const handleEdit = (client) => {
    setEditing(true);
    setSelectedClient(client);
    setOpen(true);
  };

  // DIALOGS
  const openDeactivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Desactivar cliente?",
      message: "El cliente no podrá acceder a sus datos.",
      confirmText: "Desactivar",
      confirmColor: "error",
    });
    setDialogOpen(true);
  };

  const openActivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Activar cliente?",
      message: "El cliente podrá acceder nuevamente.",
      confirmText: "Activar",
      confirmColor: "primary",
    });
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    setDialogOpen(false);

    if (dialogInfo.confirmText === "Desactivar") {
      await deactivateClient(selectedId);
      showMessage("Cliente desactivado correctamente");
    } else {
      await activateClient(selectedId);
      showMessage("Cliente activado correctamente");
    }

    loadClients();
  };

  const showMessage = (msg, type = "success") => {
    setSnackbar({ open: true, message: msg, severity: type });
  };

  const getExportParams = () => ({
    search:        filter          || undefined,
    tipoCliente:   advancedFilters.tipoCliente   || undefined,
    tipoDocumento: advancedFilters.tipoDocumento || undefined,
    estado:        showInactive ? false : true,
  });

  const exportExcel = () => handleExportExcel(getExportParams());
  const exportCSV   = () => handleExportCSV(getExportParams());

  return {
    clients,
    page, setPage,
    pageSize, setPageSize,
    totalRows,

    filter, setFilter,
    showInactive, setShowInactive,

    sortBy, setSortBy,
    advancedFilters, setAdvancedFilters,

    open, editing, selectedClient,
    setOpen, setEditing, setSelectedClient,

    dialogOpen, dialogInfo,
    setDialogOpen,
    handleConfirm,

    snackbar, showMessage,

    visibleColumns, setVisibleColumns,
    handleShowAll,
    ALL_COLUMNS,

    loadClients,

    handleAdd,
    handleEdit,
    openDeactivateDialog,
    openActivateDialog,
    exportExcel,
    exportCSV,
    loadingExcel,
    loadingCSV
  };
}
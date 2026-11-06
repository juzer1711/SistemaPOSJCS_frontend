import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getVentaById,
  deactivateVenta,
  activateVenta,
  searchVentas,
  cambiarMetodoPago,
} from "../../services/ventaService";
import { useSnackbar } from "../../context/SnackBarProvider";
import { useExport } from "../export/useExport";
import { exportVentasExcel, exportVentasCSV } from "../../services/exportService";

const ALL_COLUMNS = {
  idVenta: "ID",
  fecha: "Fecha",
  nombreCliente: "Cliente",
  documentoCliente: "Documento",
  idCaja: "Caja",
  nombreCajero: "Cajero",
  metodoPago: "Método de Pago",
  total: "Total",
  totalIVA: "IVA Total",
  estado: "Estado",
  acciones: "Acciones",
};

export const useVentaManagement = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  // ================= ESTADOS =================

  const [ventas, setVentas] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaults = {};
    Object.keys(ALL_COLUMNS).forEach((k) => (defaults[k] = true));
    return defaults;
  });

  const [sortBy, setSortBy] = useState({ key: "fecha", direction: "desc" });
  const [advancedFilters, setAdvancedFilters] = useState({ metodoPago: "" });

  const { handleExport: handleExportExcel, loadingExport: loadingExcel } =
    useExport(exportVentasExcel, "ventas.xlsx");

  const { handleExport: handleExportCSV, loadingExport: loadingCSV } =
    useExport(exportVentasCSV, "ventas.csv");

  // ================= EFECTOS =================

  useEffect(() => {
    loadVentas();
  }, [page, pageSize, sortBy, debouncedFilter, advancedFilters, showInactive]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 400);
    return () => clearTimeout(timeout);
  }, [filter]);

  // ================= LOADERS =================

  const loadVentas = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        size: pageSize,
        sort: `${sortBy.key},${sortBy.direction}`,
        search: debouncedFilter || undefined,
        metodoPago: advancedFilters.metodoPago || undefined,
        fechaInicio: advancedFilters.fechaInicio || undefined,
        fechaFin: advancedFilters.fechaFin || undefined,
        estado: showInactive ? false : true,
      };

      const res = await searchVentas(params);
      setVentas(res.data.content || []);
      setTotalRows(res.data.totalElements || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= ACCIONES =================

  const handleOpenPOS = () => navigate("/nueva-venta");

  const handleShowAll = () => {
    const all = {};
    Object.keys(visibleColumns).forEach((k) => (all[k] = true));
    setVisibleColumns(all);
  };

  const openDeactivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Desactivar venta?",
      message: "La venta no podrá ser vista hasta que lo actives nuevamente.",
      confirmText: "Desactivar",
      confirmColor: "error",
    });
    setDialogOpen(true);
  };

  const openActivateDialog = (id) => {
    setSelectedId(id);
    setDialogInfo({
      title: "¿Activar Venta?",
      message: "La venta podrá ser vista en el sistema nuevamente.",
      confirmText: "Activar",
      confirmColor: "primary",
    });
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    setDialogOpen(false);

    try {
      // 👇 NUEVO: si existe una acción personalizada, ejecútala
      if (dialogInfo.action) {
        await dialogInfo.action();
        showSnackbar("Método de pago actualizado correctamente");
        return;
      }

      // 👇 lógica vieja (activar/desactivar)
      if (dialogInfo.confirmText === "Desactivar") {
        await deactivateVenta(selectedId);
        showSnackbar("Venta desactivada");
      } else {
        await activateVenta(selectedId);
        showSnackbar("Venta activada");
      }

      loadVentas();
    } catch (error) {
      console.error(error);
      showSnackbar("Ocurrió un error", "error");
    }
  };

  const handleInactive = (id) => openDeactivateDialog(id);
  const handleActivate = (id) => openActivateDialog(id);

  const handleCambiarMetodoPago = (venta) => {

    const nuevoMetodo =
      venta.metodoPago === "EFECTIVO"
        ? "TRANSFERENCIA"
        : "EFECTIVO";

    setDialogInfo({
      title: "Cambiar método de pago",
      message: `Vas a cambiar el método de pago de la venta #${venta.idVenta}
      
  De: ${venta.metodoPago}
  A: ${nuevoMetodo}

  Esto afectará el cuadre contable de la caja.`,
      confirmText: "Cambiar método",
      confirmColor: "warning",
      action: () => cambiarMetodoPagoBackend(venta.idVenta, nuevoMetodo)
    });

    setDialogOpen(true);
  };

  const cambiarMetodoPagoBackend = async (idVenta, nuevoMetodo) => {
    await cambiarMetodoPago(idVenta, nuevoMetodo);
    await loadVentas(); 
  };

  const verDetalle = async (id) => {
    const res = await getVentaById(id);
    setVentaSeleccionada(res.data);
    setDetailOpen(true);
  };

  // Función que arma los params con los filtros activos — igual que loadVentas
  const getExportParams = () => ({
    search:      debouncedFilter  || undefined,
    metodoPago:  advancedFilters.metodoPago  || undefined,
    fechaInicio: advancedFilters.fechaInicio || undefined,
    fechaFin:    advancedFilters.fechaFin    || undefined,
    estado:      showInactive ? false : true,
    // sin page/size → trae todo
  });

  const exportExcel = () => handleExportExcel(getExportParams());
  const exportCSV   = () => handleExportCSV(getExportParams());

  return {
    // Datos
    ventas,
    ventaSeleccionada,
    // Paginación
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRows,
    loading,
    // Búsqueda y filtros
    filter,
    setFilter,
    showInactive,
    setShowInactive,
    advancedFilters,
    setAdvancedFilters,
    sortBy,
    setSortBy,
    // Columnas
    ALL_COLUMNS,
    visibleColumns,
    setVisibleColumns,
    handleShowAll,
    // Dialog confirmación
    dialogOpen,
    setDialogOpen,
    dialogInfo,
    handleConfirm,
    // Dialog detalle
    detailOpen,
    setDetailOpen,
    // Handlers
    handleOpenPOS,
    handleInactive,
    handleActivate,
    handleCambiarMetodoPago,
    verDetalle,

    exportExcel,
    exportCSV,
    loadingExcel,
    loadingCSV,
  };
};
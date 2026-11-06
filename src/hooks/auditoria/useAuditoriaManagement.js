import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { obtenerAuditoria } from "../../services/auditoriaService";
import { useExport } from "../export/useExport";
import {
  exportAuditoriaCSV,
  exportAuditoriaExcel,
} from "../../services/exportService";

export default function useAuditoriaManagement() {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");

  const [advancedFilters, setAdvancedFilters] = useState({
    usuario: "",
    modulo: "",
    accion: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState(null);
  const [openDetail, setDetailOpen] = useState(false);

  // PAGINACIÓN
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const lastRequestId = useRef(0);

  const { handleExport: handleExportExcel, loadingExport: loadingExcel } =
    useExport(exportAuditoriaExcel, "auditoria.xlsx");

  const { handleExport: handleExportCSV, loadingExport: loadingCSV } =
    useExport(exportAuditoriaCSV, "auditoria.csv");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextFilter = filter.trim();
      setDebouncedFilter(nextFilter);
      setPage(0);
    }, 350);

    return () => clearTimeout(timeout);
  }, [filter]);

  const loadAuditoria = useCallback(async () => {
    const requestId = lastRequestId.current + 1;
    lastRequestId.current = requestId;

    try {
      setLoading(true);

      const res = await obtenerAuditoria({
        page,
        size: pageSize,
        search: debouncedFilter || undefined,
        usuario: advancedFilters.usuario?.trim() || undefined,
        modulo: advancedFilters.modulo || undefined,
        accion: advancedFilters.accion || undefined,
        fechaInicio: advancedFilters.fechaInicio || undefined,
        fechaFin: advancedFilters.fechaFin || undefined,
      });

      if (requestId !== lastRequestId.current) return;

      setAuditorias(res.content || []);
      setTotalRows(res.totalElements || 0);
    } catch (e) {
      if (requestId === lastRequestId.current) {
        console.error(e);
      }
    } finally {
      if (requestId === lastRequestId.current) {
        setLoading(false);
      }
    }
  }, [page, pageSize, debouncedFilter, advancedFilters]);

  useEffect(() => {
    loadAuditoria();
  }, [loadAuditoria]);

  const handleFilterChange = useCallback((value) => {
    setFilter(value);
  }, []);

  const handleAdvancedFiltersChange = useCallback((update) => {
    setAdvancedFilters((prev) =>
      typeof update === "function" ? update(prev) : update
    );
    setPage(0);
  }, []);

  const getExportParams = useCallback(
    () => ({
      search: filter.trim() || undefined,
      usuario: advancedFilters.usuario?.trim() || undefined,
      modulo: advancedFilters.modulo || undefined,
      accion: advancedFilters.accion || undefined,
      fechaInicio: advancedFilters.fechaInicio || undefined,
      fechaFin: advancedFilters.fechaFin || undefined,
    }),
    [filter, advancedFilters]
  );

  const exportExcel = useCallback(
    () => handleExportExcel(getExportParams()),
    [handleExportExcel, getExportParams]
  );

  const exportCSV = useCallback(
    () => handleExportCSV(getExportParams()),
    [handleExportCSV, getExportParams]
  );

  const verDetalle = (log) => {
    setAuditoriaSeleccionada(log);
    setDetailOpen(true);
  };

  // STATS
  const stats = useMemo(() => {
    const accionCount = {};

    auditorias.forEach((a) => {
      accionCount[a.accion] = (accionCount[a.accion] || 0) + 1;
    });

    const accionTop =
      Object.entries(accionCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return {
      total: totalRows || auditorias.length,
      usuarios: new Set(auditorias.map((a) => a.usuario?.username)).size,
      hoy: auditorias.filter(
        (a) =>
          new Date(a.fecha).toDateString() === new Date().toDateString()
      ).length,
      modulos: new Set(auditorias.map((a) => a.modulo)).size,
      accionTop,
    };
  }, [auditorias, totalRows]);

  return {
    auditorias,
    loading,

    filter,
    setFilter: handleFilterChange,

    advancedFilters,
    setAdvancedFilters: handleAdvancedFiltersChange,

    verDetalle,
    auditoriaSeleccionada,
    openDetail,
    setDetailOpen,

    page,
    setPage,
    pageSize,
    setPageSize,
    totalRows,

    stats,

    loadAuditoria,

    exportExcel,
    exportCSV,
    loadingExcel,
    loadingCSV,
  };
}

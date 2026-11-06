import { useCallback, useEffect, useState } from "react";

/** Estado común de consulta paginada: el dominio conserva filtros, contratos y mutaciones. */
export default function useCrudQuery({ load, initialFilters, initialSort, errorMessage }) {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(initialFilters);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState(initialSort);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => { setDebouncedFilters(filters); setPage(0); }, 350);
    return () => clearTimeout(timeout);
  }, [filters]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    load({ ...debouncedFilters, page, size: pageSize, sort, signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        const total = response.totalElements || 0;
        const lastPage = Math.max(0, Math.ceil(total / pageSize) - 1);
        if (page > lastPage) { setPage(lastPage); return; }
        setRows(response.content || []); setTotalRows(total);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setRows([]); setTotalRows(0);
        setError(requestError.response?.data?.message || requestError.message || errorMessage);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [load, debouncedFilters, page, pageSize, sort, revision, errorMessage]);
  const refresh = useCallback(() => setRevision((current) => current + 1), []);
  return {
    rows, filters, debouncedFilters, page, pageSize, sort, totalRows, loading, error, refresh,
    handleFilterChange: (name, value) => setFilters((current) => ({ ...current, [name]: value })),
    clearFilters: () => setFilters(initialFilters),
    setPage,
    setPageSize: (size) => { setPageSize(size); setPage(0); },
    handleSortChange: (field) => {
      setSort((current) => ({ field, direction: current.field === field && current.direction === "asc" ? "desc" : "asc" }));
      setPage(0);
    },
  };
}
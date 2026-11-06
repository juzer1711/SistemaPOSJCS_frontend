import { Box } from "@mui/material";

import useAuditoriaManagement from "../hooks/auditoria/useAuditoriaManagement";

import AuditoriaTable from "../components/Auditoria/AuditoriaTable";
import AuditoriaSearchBar from "../components/Auditoria/AuditoriaSearchBar";
import AuditoriaDetailDialog from "../components/Auditoria/AuditoriaDetailDialog";
import AuditoriaCards from "../components/Auditoria/AuditoriaCards";

import PageHeader from "../components/ui/PageHeader";
import ManagementToolbar from "../components/ui/ManagementToolbar";
import TableContainer from "../components/ui/TableContainer";

export default function AuditoriaManagement() {
  const {
    auditorias,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRows,
    loading,

    filter,
    setFilter,

    advancedFilters,
    setAdvancedFilters,

    auditoriaSeleccionada,
    openDetail,
    setDetailOpen,

    verDetalle,

    stats,
    exportExcel,
    exportCSV,
    loadingExcel,
    loadingCSV,
  } = useAuditoriaManagement();

  return (
    <Box sx={{ p: 3 }}>

      <PageHeader
        title="Auditoría del Sistema"
        subtitle="Consulta el historial completo de acciones realizadas dentro del sistema."
      />

      <AuditoriaCards stats={stats} />

      <ManagementToolbar>
        <AuditoriaSearchBar
          filter={filter}
          onFilterChange={setFilter}
          advancedFilters={advancedFilters}
          setAdvancedFilters={setAdvancedFilters}
          onExportExcel={exportExcel}
          onExportCSV={exportCSV}
          loadingExcel={loadingExcel}
          loadingCSV={loadingCSV}
        />
      </ManagementToolbar>

      <TableContainer>
        <AuditoriaTable
          auditorias={auditorias}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalRows={totalRows}
          loading={loading}
          onView={verDetalle}
        />
      </TableContainer>

      <AuditoriaDetailDialog
        open={openDetail}
        onClose={() => setDetailOpen(false)}
        auditoria={auditoriaSeleccionada}
      />
    </Box>
  );
}

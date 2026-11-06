import { Box } from "@mui/material";
import { useVentaManagement } from "../hooks/ventas/useVentaManagement";
import VentaTable from "../components/Ventas/VentaTable";
import VentaSearchBar from "../components/Ventas/VentaSearchBar";
import VentaDetailDialog from "../components/Ventas/VentaDetailDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import PageHeader from "../components/ui/PageHeader";
import ManagementToolbar from "../components/ui/ManagementToolbar";
import TableContainer from "../components/ui/TableContainer";

export default function VentaManagement() {
  const {
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
  } = useVentaManagement();

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Gestión de Ventas"
        subtitle="Consulta, administra y revisa las ventas registradas"
      />

      <ManagementToolbar>
        <VentaSearchBar
          filter={filter}
          onFilterChange={setFilter}
          onAddVenta={handleOpenPOS}
          showInactive={showInactive}
          onToggleInactive={() => setShowInactive((p) => !p)}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          sortBy={sortBy}
          setSortBy={setSortBy}
          advancedFilters={advancedFilters}
          setAdvancedFilters={setAdvancedFilters}
          handleShowAll={handleShowAll}
          ALL_COLUMNS={ALL_COLUMNS}
          onExportExcel={exportExcel}
          onExportCSV={exportCSV}
          loadingExcel={loadingExcel}
          loadingCSV={loadingCSV}
        />
      </ManagementToolbar>
      
      <TableContainer>
        <VentaTable
          ventas={ventas}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalRows={totalRows}
          onView={verDetalle}
          onDeactivate={handleInactive}
          onActivate={handleActivate}
          onCambiarMetodoPago={handleCambiarMetodoPago} 
          visibleColumns={visibleColumns}
          loading={loading}
        />
      </TableContainer>

      <VentaDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        venta={ventaSeleccionada}
      />

      <ConfirmDialog
        open={dialogOpen}
        title={dialogInfo.title}
        message={dialogInfo.message}
        confirmText={dialogInfo.confirmText}
        confirmColor={dialogInfo.confirmColor}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
      />
    </Box>
  );
}
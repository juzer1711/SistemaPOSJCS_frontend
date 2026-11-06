import useClients from "../hooks/clients/useClientManagement";
import ClientTable from "../components/CrudClientes/ClientTable";
import ClientFormDialog from "../components/CrudClientes/ClientFormDialog";
import ClientSearchBar from "../components/CrudClientes/ClientSearchBar";
import ConfirmDialog from "../components/ConfirmDialog";
import { Box } from "@mui/material";
import PageHeader from "../components/ui/PageHeader";
import ManagementToolbar from "../components/ui/ManagementToolbar";
import TableContainer from "../components/ui/TableContainer";

const ClientManagement = () => {
  const c = useClients();

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Gestión de Clientes"
        subtitle="Administra la información y estado de los clientes"
      />

      <ClientSearchBar
        filter={c.filter}
        onFilterChange={c.setFilter}
        onAdd={c.handleAdd}
        showInactive={c.showInactive}
        onToggleInactive={() => c.setShowInactive(prev => !prev)}
        visibleColumns={c.visibleColumns}
        setVisibleColumns={c.setVisibleColumns}
        sortBy={c.sortBy}
        setSortBy={c.setSortBy}
        advancedFilters={c.advancedFilters}
        setAdvancedFilters={c.setAdvancedFilters}
        handleShowAll={c.handleShowAll}
        ALL_COLUMNS={c.ALL_COLUMNS}
        onExportExcel={c.exportExcel}
        onExportCSV={c.exportCSV}
        loadingExcel={c.loadingExcel}
        loadingCSV={c.loadingCSV}
      />
      
      <TableContainer>
        <ClientTable
          clients={c.clients}
          page={c.page}
          setPage={c.setPage}
          pageSize={c.pageSize}
          setPageSize={c.setPageSize}
          totalRows={c.totalRows}
          loading={false}
          onEdit={c.handleEdit}
          onDelete={c.openDeactivateDialog}
          onActivate={c.openActivateDialog}
          visibleColumns={c.visibleColumns}
        />
      </TableContainer>

      <ClientFormDialog
        open={c.open}
        editing={c.editing}
        selectedId={c.selectedClient?.idCliente}
        defaultValues={c.selectedClient}
        onClose={() => {
          c.setOpen(false);
          c.setEditing(false);
          c.setSelectedClient(null);
        }}
        loadClients={c.loadClients}
        showMessage={c.showMessage}
      />

      <ConfirmDialog
        open={c.dialogOpen}
        title={c.dialogInfo.title}
        message={c.dialogInfo.message}
        confirmText={c.dialogInfo.confirmText}
        confirmColor={c.dialogInfo.confirmColor}
        onClose={() => c.setDialogOpen(false)}
        onConfirm={c.handleConfirm}
      />
    </Box>
  );
};

export default ClientManagement;
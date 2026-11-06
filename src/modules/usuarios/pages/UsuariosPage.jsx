import { useMemo } from "react";
import { Alert, Button, CircularProgress, Tooltip } from "@mui/material";
import { CheckCircleOutline, HighlightOff, EditOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { usePermissions } from "../../../context/PermissionsContext.jsx";
import CrudPageHeader from "../../../components/ui/crud/CrudPageHeader.jsx";
import CrudFilterBar from "../../../components/ui/crud/CrudFilterBar.jsx";
import CrudDataTable from "../../../components/ui/crud/CrudDataTable.jsx";
import CrudFormDialog from "../../../components/ui/crud/CrudFormDialog.jsx";
import ManagementToolbar from "../../../components/ui/ManagementToolbar.jsx";
import ConfirmDialog from "../../../components/ConfirmDialog.jsx";
import useUsuarios from "../hooks/useUsuarios.js";
import { usuarioFields, documentOptions, EMPTY_USUARIO } from "../validation/usuarioFields.js";
import styles from "./UsuariosPage.module.css";

export default function UsuariosPage() {
  const usuarios = useUsuarios();
  const { can } = usePermissions();
  const canCreate = can("USUARIOS", "INSERCION");
  const canUpdate = can("USUARIOS", "ACTUALIZACION");
  const canExport = can("USUARIOS", "REPORTE");
  const editing = Boolean(usuarios.selectedUser);
  const fields = useMemo(() => usuarioFields(usuarios.types, editing), [usuarios.types, editing]);
  const filters = [
    { name: "search", label: "Buscar usuarios", placeholder: "Nombre, usuario, documento o correo", maxLength: 150 },
    { name: "tipoDocumento", label: "Tipo de documento", options: [{ value: "", label: "Todos" }, ...documentOptions(usuarios.types)] },
    { name: "estado", label: "Estado", defaultValue: "true", options: [
      { value: "true", label: "Activos" }, { value: "false", label: "Inactivos" }, { value: "", label: "Todos" },
    ] },
  ];
  const columns = [
    { field: "idUsuario", headerName: "ID", sortable: true },
    { field: "username", headerName: "Usuario", sortable: true },
    { field: "nombreCompleto", headerName: "Nombre completo", sortable: true },
    { field: "tipoDocumento", headerName: "Tipo de documento", sortable: true,
      render: (value) => documentOptions([value])[0].label },
    { field: "documento", headerName: "Documento", sortable: true },
    { field: "email", headerName: "Correo", sortable: true },
    { field: "telefono", headerName: "Teléfono" },
    { field: "estado", headerName: "Estado", sortable: true, render: (active, row) => (
      <Tooltip title={canUpdate ? (active ? "Desactivar usuario" : "Activar usuario") : "Sin permiso de actualización"}>
        <span><Button size="small" className={active ? styles.active : styles.inactive}
          startIcon={active ? <CheckCircleOutline /> : <HighlightOff />}
          disabled={!canUpdate || usuarios.statePending || usuarios.loading}
          aria-label={(active ? "Desactivar " : "Activar ") + row.username}
          onClick={() => usuarios.askState(row)}>{active ? "Activo" : "Inactivo"}</Button></span>
      </Tooltip>
    ) },
  ];
  return (
    <div className={styles.page}>
      <CrudPageHeader title="Gestión de usuarios" subtitle="Administra las cuentas de acceso y su estado."
        actionLabel={canCreate ? "Nuevo usuario" : undefined} onAction={usuarios.openCreate}
        actionDisabled={usuarios.typesLoading || Boolean(usuarios.typesError)} />
      {usuarios.typesError && <Alert severity="error" className={styles.notice}
        action={<Button onClick={usuarios.retryTypes}>Reintentar</Button>}>{usuarios.typesError}</Alert>}
      <ManagementToolbar>
        <CrudFilterBar fields={filters} values={usuarios.filters} onChange={usuarios.handleFilterChange} onClear={usuarios.clearFilters} />
        {canExport && <div className={styles.exports}>
          <Button variant="outlined" disabled={usuarios.loadingExcel} onClick={usuarios.exportExcel}
            startIcon={usuarios.loadingExcel ? <CircularProgress size={16} /> : <FileDownloadOutlined />}>Excel</Button>
          <Button variant="outlined" disabled={usuarios.loadingCSV} onClick={usuarios.exportCSV}
            startIcon={usuarios.loadingCSV ? <CircularProgress size={16} /> : <FileDownloadOutlined />}>CSV</Button>
        </div>}
      </ManagementToolbar>
      <CrudDataTable columns={columns} rows={usuarios.rows} rowKey="idUsuario" sort={usuarios.sort} onSortChange={usuarios.handleSortChange}
        page={usuarios.page} rowsPerPage={usuarios.pageSize} totalRows={usuarios.totalRows}
        onPageChange={(_, page) => usuarios.setPage(page)} onRowsPerPageChange={(event) => usuarios.setPageSize(Number(event.target.value))}
        loading={usuarios.loading} error={usuarios.error} onRetry={usuarios.refresh}
        emptyMessage="No se encontraron usuarios. Ajusta los filtros."
        actions={canUpdate ? [{ id: "edit", label: "Editar", Icon: EditOutlined, onClick: usuarios.openEdit,
          disabled: usuarios.typesLoading || Boolean(usuarios.typesError) || usuarios.statePending }] : []} />
      {(editing ? canUpdate : canCreate) && <CrudFormDialog open={usuarios.formOpen} fields={fields} editing={editing}
        title={editing ? "Editar usuario" : "Crear usuario"} initialValues={usuarios.selectedUser || EMPTY_USUARIO}
        onClose={usuarios.closeForm} onSubmit={usuarios.save} />}
      <ConfirmDialog open={Boolean(usuarios.stateTarget) && canUpdate} pending={usuarios.statePending} error={usuarios.stateError}
        title={usuarios.stateTarget?.estado ? "¿Desactivar usuario?" : "¿Activar usuario?"}
        message={usuarios.stateTarget?.estado ? "El usuario no podrá utilizar el sistema mientras esté inactivo." : "El usuario podrá utilizar el sistema nuevamente."}
        confirmText={usuarios.stateTarget?.estado ? "Desactivar" : "Activar"}
        confirmColor={usuarios.stateTarget?.estado ? "error" : "primary"} onClose={usuarios.closeState} onConfirm={usuarios.confirmState} />
    </div>
  );
}
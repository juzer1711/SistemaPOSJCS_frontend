import { Alert, Checkbox, CircularProgress } from "@mui/material";
import AsyncAutocomplete from "../../../components/ui/AsyncAutocomplete.jsx";
import CrudDataTable from "../../../components/ui/crud/CrudDataTable.jsx";
import CrudPageHeader from "../../../components/ui/crud/CrudPageHeader.jsx";
import { listarUsuariosReglas, listarModulosReglas } from "../services/reglasApi.js";
import useMatrizPermisos, { PERMISSION_COLUMNS } from "../hooks/useMatrizPermisos.js";
import styles from "./ReglasPage.module.css";

export default function ReglasPage() {
  const matriz = useMatrizPermisos();
  const columns = [
    { field: "nombreModulo", headerName: "Módulo", render: (_, row) => (
      <div className={styles.module}><strong>{row.nombreModulo}</strong><span>{row.codigoModulo}</span></div>
    ) },
    ...PERMISSION_COLUMNS.map((column) => ({
      ...column,
      align: "center",
      render: (value, row) => (
        <div className={styles.permission}>
          <Checkbox checked={value === true}
            onChange={() => matriz.toggle(row, column)}
            disabled={!matriz.canUpdate || Boolean(matriz.pending) || matriz.loading}
            inputProps={{ "aria-label": column.headerName + " para " + row.nombreModulo }}
          />
          {matriz.pending?.moduloId === row.moduloId && matriz.pending.field === column.field && (
            <CircularProgress size={16} aria-label="Guardando permiso" />
          )}
        </div>
      ),
    })),
  ];
  return (
    <div className={styles.page}>
      <CrudPageHeader title="Matriz de permisos" subtitle="Selecciona un usuario y administra sus permisos por módulo. Cada cambio se guarda inmediatamente." />
      <section className={styles.filters} aria-label="Filtros de permisos">
        <AsyncAutocomplete label="Usuario" value={matriz.usuario} onChange={matriz.selectUsuario}
          loadOptions={listarUsuariosReglas} getOptionLabel={(option) => option.username}
          getOptionKey={(option) => option.idUsuario} disabled={Boolean(matriz.pending)} />
        <AsyncAutocomplete label="Módulo" value={matriz.modulo} onChange={matriz.selectModulo}
          loadOptions={listarModulosReglas} getOptionLabel={(option) => option.nombreModulo + " (" + option.codigoModulo + ")"}
          getOptionKey={(option) => option.idModulo} disabled={Boolean(matriz.pending)} />
      </section>
      {!matriz.canUpdate && <Alert severity="info" className={styles.notice}>Puedes consultar esta matriz. No tienes permiso para modificar reglas.</Alert>}
      <CrudDataTable columns={columns} rows={matriz.rows} rowKey="moduloId"
        page={matriz.page} rowsPerPage={matriz.pageSize} totalRows={matriz.totalRows}
        onPageChange={(_, next) => matriz.setPage(next)}
        onRowsPerPageChange={(event) => matriz.setPageSize(Number(event.target.value))}
        loading={matriz.loading} error={matriz.error} onRetry={matriz.retry}
        emptyMessage={matriz.usuario ? "No se encontraron módulos para este filtro." : "Selecciona un usuario para consultar sus permisos."}
      />
      <p className={styles.status} role="status">{matriz.pending ? "Guardando permiso…" : "Los permisos son independientes entre sí."}</p>
    </div>
  );
}
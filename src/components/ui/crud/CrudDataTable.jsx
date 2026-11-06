import { RefreshRounded } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import CrudPagination from "./CrudPagination.jsx";
import styles from "./CrudComponents.module.css";

export default function CrudDataTable({
  columns,
  sort,
  onSortChange,
  rows,
  rowKey,
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  actions = [],
  loading = false,
  error = null,
  onRetry,
  emptyMessage = "No hay registros para mostrar.",
}) {
  const renderBody = () => {
    const columnCount = columns.length + Number(actions.length > 0);

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={columnCount}>
            <Alert
              severity="error"
              action={
                onRetry && (
                  <Button color="inherit" size="small" startIcon={<RefreshRounded />} onClick={onRetry}>
                    Reintentar
                  </Button>
                )
              }
            >
              {error}
            </Alert>
          </TableCell>
        </TableRow>
      );
    }

    if (loading && rows.length === 0) {
      return (
        <TableRow>
          <TableCell className={styles.stateCell} colSpan={columnCount}>
            <CircularProgress size={28} aria-label="Cargando registros" />
          </TableCell>
        </TableRow>
      );
    }

    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell className={styles.stateCell} colSpan={columnCount}>
            {emptyMessage}
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((row) => (
      <TableRow hover key={row[rowKey]}>
        {columns.map(({ field, render, className }) => (
          <TableCell className={className} key={field}>
            {render ? render(row[field], row) : row[field] ?? "—"}
          </TableCell>
        ))}
        {actions.length > 0 && (
          <TableCell className={styles.actionsCell} align="right">
            {actions.map(({ id, label, Icon, onClick, color = "primary", disabled }) => (
              <Tooltip title={label} key={id}>
                <IconButton
                  size="small"
                  color={color}
                  aria-label={`${label} ${row[rowKey]}`}
                  onClick={() => onClick(row)}
                  disabled={typeof disabled === "function" ? disabled(row) : disabled}
                >
                  <Icon fontSize="small" />
                </IconButton>
              </Tooltip>
            ))}
          </TableCell>
        )}
      </TableRow>
    ));
  };

  return (
    <Paper className={styles.tablePaper} elevation={0} aria-busy={loading}>
      <div className={styles.tableScroller}>
        <Table size="medium" aria-label="Tabla de registros">
          <TableHead>
            <TableRow>
              {columns.map(({ field, headerName, align, sortable }) => (
                <TableCell align={align} key={field} sortDirection={sort?.field === field ? sort.direction : false}>
                  {sortable && onSortChange ? (
                    <TableSortLabel
                      hideSortIcon
                      active={sort?.field === field}
                      direction={sort?.field === field ? sort.direction : "asc"}
                      onClick={() => onSortChange(field)}
                      aria-label={`Ordenar por ${headerName} ${sort?.field === field && sort.direction === "asc" ? "descendente" : "ascendente"}`}
                    >
                      {headerName}
                    </TableSortLabel>
                  ) : headerName}
                </TableCell>
              ))}
              {actions.length > 0 && <TableCell align="right">Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>{renderBody()}</TableBody>
        </Table>
      </div>
      <CrudPagination
        count={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}

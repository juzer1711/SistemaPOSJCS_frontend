import { TablePagination } from "@mui/material";
import styles from "./CrudComponents.module.css";

export default function CrudPagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) {
  return (
    <TablePagination
      className={styles.pagination}
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 20, 50]}
      labelRowsPerPage="Filas por página:"
      labelDisplayedRows={({ from, to, count: total }) =>
        `${from}–${to} de ${total !== -1 ? total : `más de ${to}`}`
      }
    />
  );
}

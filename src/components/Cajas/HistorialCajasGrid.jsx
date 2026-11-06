import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Tooltip, Chip } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { formatDateTime, formatMoney } from "../../utils/formats";

export default function HistorialCajasGrid({
  rows, totalRows, page, onPageChange, onVerDetalle, loading,
}) {
  const columns = [
    {
      field: "idCaja",
      headerName: "Caja",
      width: 80,
      renderCell: (params) => (
        <Chip label={`#${params.value}`} size="small" variant="outlined" />
      ),
    },
    { field: "nombreCajero", headerName: "Cajero", flex: 1, minWidth: 160 },
    {
      field: "fechaApertura",
      headerName: "Apertura",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => formatDateTime(params.value),
    },
    {
      field: "fechaCierre",
      headerName: "Cierre",
      flex: 1,
      minWidth: 160,
      renderCell: (params) =>
        params.value ? formatDateTime(params.value) : "—",
    },
    {
      field: "totalVentas",
      headerName: "Total ventas",
      width: 140,
      renderCell: (params) => formatMoney(params.value ?? 0),
    },
    {
      field: "montoFinal",
      headerName: "Monto final",
      width: 140,
      renderCell: (params) => formatMoney(params.value ?? 0),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Ver detalle completo" arrow>
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => onVerDetalle(params.row.idCaja)}
            sx={{ fontSize: 11 }}
          >
            Ver
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows || []}
        columns={columns}
        getRowId={(row) => row.idCaja}
        rowCount={totalRows || 0}
        loading={loading}
        paginationMode="server"
        pageSizeOptions={[10]}
        paginationModel={{ page: page ?? 0, pageSize: 10 }}
        onPaginationModelChange={(model) => onPageChange(model.page)}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "background.default",
            fontSize: "0.75rem",
          },
        }}
      />
    </Box>
  );
}
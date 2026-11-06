import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Tooltip, Chip } from "@mui/material";
import {
  Visibility  as VisibilityIcon,
  LockOpen    as ForceCloseIcon,
} from "@mui/icons-material";
import { formatDateTime, formatMoney } from "../../utils/formats";

export default function CajasAbiertasGrid({
  rows, totalRows, page, onPageChange,
  onVerDetalle, onForzarCierre, loading,
}) {
  const columns = [
    {
      field: "idCaja",
      headerName: "Caja",
      width: 80,
      renderCell: (params) => (
        <Chip label={`#${params.value}`} size="small"
          color="success" variant="outlined" />
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
      field: "montoInicial",
      headerName: "Monto inicial",
      width: 140,
      renderCell: (params) => formatMoney(params.value),
    },
    {
      field: "totalVentas",
      headerName: "Total ventas",
      width: 140,
      renderCell: (params) => formatMoney(params.value ?? 0),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Tooltip title="Ver detalle de la caja" arrow>
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
          <Tooltip title="Forzar cierre de caja" arrow>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<ForceCloseIcon />}
              onClick={() => onForzarCierre(params.row.idCaja)}
              sx={{ fontSize: 11 }}
            >
              Forzar cierre
            </Button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows || []}
        columns={columns}
        getRowId={(row) => row.idCaja}
        paginationMode="server"
        rowCount={totalRows || 0}
        pageSizeOptions={[10]}
        paginationModel={{ page: page ?? 0, pageSize: 10 }}
        onPaginationModelChange={(model) => onPageChange(model.page)}
        loading={loading}
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
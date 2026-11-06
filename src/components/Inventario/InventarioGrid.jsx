import { DataGrid } from "@mui/x-data-grid";
import { Chip, Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";

const getEstado = (row) => {
  if (row.stockActual <= 0)
    return { label: "Sin stock", color: "error" };
  // ✅ solo activa "Bajo" si stockMinimo está configurado
  if (row.stockMinimo > 0 && row.stockActual <= row.stockMinimo)
    return { label: "Bajo", color: "warning" };
  return { label: "Normal", color: "success" };
};

const getStockColor = (row) => {
  if (row.stockActual <= 0) return "error.main";
  if (row.stockMinimo > 0 && row.stockActual <= row.stockMinimo) return "warning.main";
  return "success.main";
};

export default function InventarioGrid({ rows, page, onPageChange, onEditStockMinimo }) {
  const columns = [
    {
      field: "idProducto",
      headerName: "ID",
      width: 70,
    },
    {
      field: "nombre",
      headerName: "Producto",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "stockActual",
      headerName: "Stock actual",
      width: 130,
      renderCell: (params) => (
        <Typography
          variant="body2"
          fontWeight={700}
          color={getStockColor(params.row)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "stockMinimo",
      headerName: "Stock mínimo",
      width: 170,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            color={params.value > 0 ? "text.primary" : "text.disabled"}
            fontWeight={600}
          >
            {params.value > 0 ? params.value : "No configurado"}
          </Typography>

          <Tooltip title="Editar stock mínimo">
            <IconButton
              size="small"
              onClick={() => onEditStockMinimo(params.row)}
            >
              <Edit fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 140,
      renderCell: (params) => {
        const { label, color } = getEstado(params.row);
        return <Chip label={label} color={color} size="small" />;
      },
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows || []}
        getRowId={(row) => row.idProducto}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25]}
        paginationModel={{ page: page ?? 0, pageSize: 10 }}
        onPaginationModelChange={(model) => onPageChange?.(model.page)}
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
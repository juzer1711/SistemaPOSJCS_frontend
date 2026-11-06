import { DataGrid } from "@mui/x-data-grid";
import { Chip, Typography, Box } from "@mui/material";

const TIPO_CONFIG = {
  ENTRADA: { color: "success", label: "Entrada" },
  SALIDA:  { color: "error",   label: "Salida"  },
  VENTA:   { color: "info",    label: "Venta"   },
};

export default function MovimientosGrid({
  rows, totalRows, page, onPageChange, onRowClick,
}) {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "nombreProducto",
      headerName: "Producto",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      width: 120,
      renderCell: ({ value }) => {
        const cfg = TIPO_CONFIG[value] ?? { color: "default", label: value };
        return <Chip label={cfg.label} color={cfg.color} size="small" />;
      },
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      width: 110,
      // ✅ firma MUI X v7
      renderCell: (params) => {
        const tipo = params.row.tipo;
        const color = tipo === "ENTRADA" ? "success.main" : "error.main";
        const prefix = tipo === "ENTRADA" ? "+" : "-";
        return (
          <Typography variant="body2" fontWeight={700} color={color}>
            {prefix}{params.value}
          </Typography>
        );
      },
    },
    {
      field: "motivo",
      headerName: "Motivo",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.value || "—"}
        </Typography>
      ),
    },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 170,
      valueGetter: (value) => {
        if (!value) return null;
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
      },
      valueFormatter: (value) => {
        if (!value) return "—";
        return value.toLocaleString("es-CO", {
          dateStyle: "short",
          timeStyle: "short",
        });
      },
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows || []}
        getRowId={(row) => row.id}
        columns={columns}
        rowCount={totalRows || 0}
        paginationMode="server"
        pageSizeOptions={[10]}
        paginationModel={{ page: page ?? 0, pageSize: 10 }}
        onPaginationModelChange={(model) => onPageChange?.(model.page)}
        onRowClick={(params) => onRowClick?.(params.row)}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          border: "none",
          "& .MuiDataGrid-row": { cursor: "pointer" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "background.default",
            fontSize: "0.75rem",
          },
        }}
      />
    </Box>
  );
}
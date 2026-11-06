import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Button, Chip, Tooltip } from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";
import { dataGridStyles } from "../../styles/dataGridStyles";

export default function ProductTable({
  products,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalRows,
  onEdit,
  onDelete,
  onActivate,
  loading
}) {

  const formatIVA = (iva) => {
    if (!iva) return "—";
    const number = iva.replace("IVA_", "");
    return `${number} %`;
  };

  const columns = [
    { field: "idProducto", headerName: "ID", width: 90 },

    { field: "nombre", headerName: "Nombre", width: 180 },

    {
      field: "categoria",
      headerName: "Categoría",
      width: 180,
      renderCell: (params) => params.row?.categoria?.nombre || ""
    },

    { field: "codigoBarras", headerName: "Código", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 200 },
    { field: "costo", headerName: "Costo", width: 120 },
    { field: "precioventa", headerName: "Precio Venta", width: 150 },

    {
      field: "iva",
      headerName: "IVA",
      width: 120,
      renderCell: (params) => formatIVA(params.row?.iva)
    },

    { field: "precioSinIva", headerName: "Sin IVA", width: 150 },

    {
      field: "stockActual",
      headerName: "Stock",
      width: 150,
      renderCell: (params) => {
        const stock = params.row.stockActual;
        const min = params.row.stockMinimo;

        let color = "success";
        let label = stock;

        if (stock <= 0) {
          color = "error";
          label = `Sin stock (${stock})`;
        } else if (stock <= min) {
          color = "warning";
          label = `Bajo (${stock})`;
        }

        let bg = "rgba(22,163,74,0.12)";
        let text = "#16A34A";

        if (stock <= 0) {
          bg = "rgba(239,68,68,0.12)";
          text = "#DC2626";
        } else if (stock <= min) {
          bg = "rgba(245,158,11,0.14)";
          text = "#D97706";
        }

        return (
          <Chip
            label={label}
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              backgroundColor: bg,
              color: text,
            }}
          />
        );
      }
    },

    {
      field: "estado",
      headerName: "Estado",
      width: 140,
      renderCell: (params) => {
        const active = params.value === true || params.value === 1;
        return (
          <Chip
            icon={active ? <CheckCircle /> : <Cancel />}
            label={active ? "Activo" : "Inactivo"}
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: "8px",

              backgroundColor: active
                ? "rgba(22,163,74,0.12)"
                : "rgba(148,163,184,0.16)",

              color: active
                ? "#16A34A"
                : "#64748B",
            }}
          />
        );
      }
    },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 180,
      sortable: false,
      renderCell: (params) => {
        const p = params.row;
        const active = p.estado === true || p.estado === 1;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Tooltip title="Editar usuario" arrow>
              <IconButton size="small" onClick={() => onEdit(p)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip 
              title={active ? "Desactivar producto" : "Activar producto"} 
              arrow
            >
              <Button
                size="small"
                color={active ? "error" : "primary"}
                onClick={() =>
                  active
                    ? onDelete(p.idProducto)
                    : onActivate(p.idProducto)
                }
                sx={{
                  minWidth: "auto",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: active ? "#DC2626" : "#2563EB",

                  "&:hover": {
                    backgroundColor: active
                      ? "rgba(220,38,38,0.08)"
                      : "rgba(37,99,235,0.08)",
                  },
                }}
              >
                {active ? "Desactivar" : "Activar"}
              </Button>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <DataGrid
        sx={dataGridStyles}
        rows={products || []}
        columns={columns}
        getRowId={(row) => row.idProducto}

        paginationMode="server"
        rowCount={totalRows || 0}

        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}

        loading={loading}
      />
    </Box>
  );
}

import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { dataGridStyles } from "../../styles/dataGridStyles";
import {  CheckCircle, Cancel, Edit } from "@mui/icons-material";


export default function VentaTable({
  ventas,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalRows,
  onView,
  onDeactivate,
  onActivate,
  onCambiarMetodoPago,
  visibleColumns,
  loading
}) {

  const columns = [
    { field: "idVenta", headerName: "ID", width: 90 },

    {
      field: "fecha",
      headerName: "Fecha",
      width: 180,
      renderCell: (params) => {
      const fecha = params.row.fecha;
      if (!fecha) return "-";

      const date = new Date(fecha);
      return isNaN(date) ? "-" : date.toLocaleString("es-CO");
    }
    },

    { field: "nombreCliente", headerName: "Cliente", width: 200 },

    { field: "documentoCliente", headerName: "Documento", width: 150 },

    { field: "idCaja", headerName: "Caja", width: 90 },

    { field: "nombreCajero", headerName: "Cajero", width: 160 },

    {
      field: "metodoPago",
      headerName: "Método Pago",
      width: 190,
      renderCell: (params) => {
        const v = params.row;

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {params.value}

            {v.estado && (
              <Tooltip title="Cambiar método de pago (cruce contable)" arrow>
                <IconButton
                  size="small"
                  onClick={() => onCambiarMetodoPago(v)}   // ✅ SOLO PASA LA VENTA
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      }
    },

    {
      field: "total",
      headerName: "Total",
      width: 120,
      renderCell: (params) => {
      const total = params.row.total;
      return `$${Number(total || 0).toLocaleString("es-CO")}`;
    }
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 130,
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

        const v = params.row;
        const active = v.estado === true || v.estado === 1;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Tooltip title="Ver detalles de la venta" arrow>
              <IconButton
                size="small"
                onClick={() => onView(v.idVenta)}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {active ? (
              <Tooltip title="Desactivar venta" arrow>
                <Button
                  size="small"
                  color="error"
                  variant="text"
                  sx={{
                    minWidth: "auto",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "8px",
                  }}
                  onClick={() => onDeactivate(v.idVenta)}
                >
                  Desactivar
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Activar venta" arrow>
                <Button
                  size="small"
                  color="primary"
                  variant="text"
                  sx={{
                    minWidth: "auto",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "8px",
                  }}
                  onClick={() => onActivate(v.idVenta)}
                >
                  Activar
                </Button>
              </Tooltip>
            )}
          </Box>
        );
      }
    }
  ];

  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <DataGrid
        sx={dataGridStyles}
        rows={ventas || []}
        columns={columns}
        getRowId={(row) => row.idVenta}

        paginationMode="server"
        sortingMode="server"

        rowCount={totalRows || 0}

        paginationModel={{ page, pageSize }}

        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}

        onSortModelChange={(model) => {
          if (model.length > 0) {
            setSortBy({
              key: model[0].field,
              direction: model[0].sort
            });
          }
        }}

        loading={loading}
      />
    </Box>
  );
}


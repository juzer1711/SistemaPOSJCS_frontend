import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, Tooltip } from "@mui/material";
import { getAccionColor } from "../../utils/auditoriaColors";
import { dataGridStyles } from "../../styles/dataGridStyles";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function AuditoriaTable({
  auditorias,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalRows,
  loading,
  onView,
}) {

  const columns = [
    {
        field: "id",
        headerName: "ID",
        width: 80,
    },

    {
        field: "fecha",
        headerName: "Fecha",
        width: 190,
        renderCell: (params) => {
            if (!params.value) return "-";
            return new Date(params.value).toLocaleString("es-CO");
        },
    },

    {
        field: "usuario",
        headerName: "Usuario",
        width: 160,
        valueGetter: (value, row) => row.usuario?.username || "-",
    },

    {
        field: "nombreCompleto",
        headerName: "Nombre",
        width: 200,
        valueGetter: (value, row) => row.usuario?.nombreCompleto || "-",
    },

    {
        field: "modulo",
        headerName: "Módulo",
        width: 180,
    },

    {
        field: "accion",
        headerName: "Acción",
        width: 140,
        renderCell: (params) => (
            <Chip
            label={params.value}
            color={getAccionColor(params.value)}
            size="small"
            />
        ),
    },
    {
        field: "descripcion",
        headerName: "Descripción",
        flex: 1,
        minWidth: 300,
        renderCell: (params) => (
            <Tooltip title={params.value || ""}>
            <span
                style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                width: "100%",
                }}
            >
                {params.value}
            </span>
            </Tooltip>
        ),
    },
    {
        field: "detalle",
        headerName: "Detalle",
        width: 90,
        sortable: false,
        renderCell: (params) => (
            <IconButton
                size="small"
                color="primary"
                onClick={() => {
                    onView(params.row);
                }}
            >
                <VisibilityIcon fontSize="small" />
            </IconButton>
        ),
    }
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        sx={dataGridStyles}
        rows={auditorias}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}

        // SERVER SIDE PAGINATION
        paginationMode="server"
        rowCount={totalRows}

        paginationModel={{
          page,
          pageSize,
        }}

        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}

        pageSizeOptions={[10, 20, 50, 100]}

        disableRowSelectionOnClick

        disableColumnMenu
      />
    </Box>
  );
}
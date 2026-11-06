import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Button, Chip, Tooltip } from "@mui/material";
import { Edit, CheckCircle, Cancel } from "@mui/icons-material";
import { dataGridStyles } from "../../styles/dataGridStyles";

export default function ClientTable({
  clients,
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

  const columns = [
    { field: "idCliente", headerName: "ID", width: 90 },

    { field: "tipoCliente", headerName: "Tipo Cliente", width: 150 },

    { 
      field: "nombreCompleto", 
      headerName: "Nombre Completo", 
      width: 280,
      renderCell: (params) => {
        const c = params.row;
        return [
          c.primerNombre,
          c.segundoNombre,
          c.primerApellido,
          c.segundoApellido
        ].filter(Boolean).join(" ");
      }
    },

    { field: "razonSocial", headerName: "Razón Social", width: 180 },

    { field: "tipoDocumento", headerName: "Tipo Documento", width: 180 },
    { field: "documento", headerName: "Documento", width: 150 },

    { field: "identificadorNit", headerName: "DV", width: 100 },

    { field: "direccion", headerName: "Dirección", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "telefono", headerName: "Teléfono", width: 150 },

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
        const c = params.row;
        const active = c.estado === true || c.estado === 1;

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>

            <Tooltip title="Editar cliente" arrow>
              <IconButton
                size="small"
                onClick={() => onEdit(c)}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={active ? "Desactivar cliente" : "Activar cliente"}
              arrow
            >
              <Button
                size="small"
                color={active ? "error" : "primary"}
                onClick={() =>
                  active
                    ? onDelete(c.idCliente)
                    : onActivate(c.idCliente)
                }
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
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
        rows={clients || []}
        columns={columns}
        getRowId={(row) => row.idCliente}

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
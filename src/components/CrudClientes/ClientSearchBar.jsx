import React, { useState } from "react";
import {
  Box, TextField, InputAdornment, Button, IconButton,
  Menu, MenuItem, Checkbox, FormControlLabel, Chip, Tooltip
} from "@mui/material";
import { Add, Search, Settings } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableViewIcon    from "@mui/icons-material/TableView";
import { CircularProgress } from "@mui/material";

const SORT_FIELDS = [
  { value: "primerNombre", label: "Primer Nombre" },
  { value: "primerApellido", label: "Primer Apellido" },
  { value: "razonSocial", label: "Razón Social" },
  { value: "documento", label: "Documento" },
];

const ClientSearchBar = ({
  filter, onFilterChange, onAdd,
  showInactive, onToggleInactive,
  visibleColumns, setVisibleColumns,
  sortBy, setSortBy,
  advancedFilters, setAdvancedFilters,
  handleShowAll, ALL_COLUMNS,
  onExportExcel,
  onExportCSV,
  loadingExcel,
  loadingCSV
}) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleColumnsClick = (e) => setAnchorEl(e.currentTarget);
  const handleColumnsClose = () => setAnchorEl(null);

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSortChange = (e) => {
    const [key, dir] = e.target.value.split("|");
    setSortBy({ key, direction: dir });
  };

  const handleAdvFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({ ...prev, [field]: value }));
  };

  return (

    <Box
      sx={{
        mb: 2.5,
        p: 2,
        borderRadius: "16px",
        backgroundColor: "background.paper",
        border: "1px solid #E2E8F0",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >

      {/* IZQUIERDA */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          flexWrap: "wrap",
          flex: 1,
        }}
      >

        {/* BUSCADOR */}
        <TextField
          size="small"
          placeholder="Buscar cliente..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{
            minWidth: 260,

            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#64748B" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* COLUMNAS */}
        <Tooltip title="Configurar columnas" arrow>
          <IconButton
            size="small"
            onClick={handleColumnsClick}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Settings />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleColumnsClose}
          PaperProps={{
            sx: {
              width: 240,
              borderRadius: "14px",
              mt: 1,
            },
          }}
        >

          <MenuItem
            disableRipple
            sx={{
              opacity: 0.7,
              fontWeight: 700,
              cursor: "default",
              fontSize: "0.8rem",
            }}
          >
            Columnas visibles
          </MenuItem>

          <MenuItem onClick={handleShowAll}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Object.values(visibleColumns).every(v => v)}
                />
              }
              label="Mostrar todas"
            />
          </MenuItem>

          <Box sx={{ borderTop: "1px solid #E2E8F0", my: 1 }} />

          {Object.keys(visibleColumns).map((k) => (
            <MenuItem key={k} onClick={() => toggleColumn(k)}>
              <FormControlLabel
                control={<Checkbox checked={visibleColumns[k]} />}
                label={ALL_COLUMNS[k]}
              />
            </MenuItem>
          ))}

        </Menu>

        {/* TIPO CLIENTE */}
        <TextField
          select
          size="small"
          label="Tipo Cliente"
          value={advancedFilters.tipoCliente || ""}
          onChange={(e) =>
            handleAdvFilterChange("tipoCliente", e.target.value)
          }
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="PERSONA_NATURAL">
            Persona Natural
          </MenuItem>
          <MenuItem value="EMPRESA">
            Empresa
          </MenuItem>
        </TextField>

        {/* DOCUMENTO */}
        <TextField
          select
          size="small"
          label="Tipo Documento"
          value={advancedFilters.tipoDocumento || ""}
          onChange={(e) =>
            handleAdvFilterChange("tipoDocumento", e.target.value)
          }
          sx={{ minWidth: 190 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="CEDULA_CIUDADANIA">
            Cédula
          </MenuItem>
          <MenuItem value="NIT">
            NIT
          </MenuItem>
          <MenuItem value="PASAPORTE">
            Pasaporte
          </MenuItem>
        </TextField>

        {/* ACTIVOS */}
        <Tooltip title={showInactive ? "Mostrar activos" : "Mostrar inactivos"}>
          <Chip
            label={showInactive ? "Inactivos" : "Activos"}
            color={showInactive ? "default" : "primary"}
            onClick={onToggleInactive}
            clickable
            sx={{
              height: 38,
              px: 1,
              fontWeight: 600,
            }}
          />
        </Tooltip>

      </Box>

      <Button
        variant="outlined"
        size="small"
        startIcon={loadingExcel
          ? <CircularProgress size={14} color="inherit" />
          : <FileDownloadIcon />}
        onClick={onExportExcel}
        disabled={loadingExcel}
      >
        Excel
      </Button>

      <Button
        variant="outlined"
        size="small"
        startIcon={loadingCSV
          ? <CircularProgress size={14} color="inherit" />
          : <TableViewIcon />}
        onClick={onExportCSV}
        disabled={loadingCSV}
      >
        CSV
      </Button>

      {/* BOTÓN */}
      <Tooltip title="Registrar nuevo cliente" arrow>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
          sx={{
            borderRadius: "12px",
            px: 2.2,
            fontWeight: 600,
            boxShadow: "none",
          }}
        >
          Nuevo Cliente
        </Button>
      </Tooltip>

    </Box>

  );
};

export default ClientSearchBar;
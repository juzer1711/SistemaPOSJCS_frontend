import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  Chip,
  Tooltip
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableViewIcon    from "@mui/icons-material/TableView";
import { CircularProgress } from "@mui/material";

const VentaSearchBar = ({
  filter,
  onFilterChange,
  onAddVenta,
  showInactive,
  onToggleInactive,
  advancedFilters,
  setAdvancedFilters,
  onExportExcel, 
  onExportCSV, 
  loadingExcel,
  loadingCSV
}) => {

  const handleChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >

      {/* 🔍 FILTROS */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>

        {/* BUSCADOR */}
        <TextField
          size="small"
          placeholder="Buscar cliente, documento..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />

        {/* MÉTODO DE PAGO */}
        <TextField
          select
          size="small"
          label="Método"
          value={advancedFilters.metodoPago || ""}
          onChange={(e) => handleChange("metodoPago", e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="EFECTIVO">Efectivo</MenuItem>
          <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
        </TextField>

        {/* FECHA INICIO */}
        <DatePicker
          label="Desde"
          value={advancedFilters.fechaInicio ? dayjs(advancedFilters.fechaInicio) : null}
          onChange={(newValue) =>
            handleChange(
              "fechaInicio",
              newValue ? newValue.format("YYYY-MM-DD") : ""
            )
          }
          slotProps={{
            textField: { size: "small", sx: { minWidth: 140 } }
          }}
        />

        {/* FECHA FIN */}
        <DatePicker
          label="Hasta"
          value={advancedFilters.fechaFin ? dayjs(advancedFilters.fechaFin) : null}
          onChange={(newValue) =>
            handleChange(
              "fechaFin",
              newValue ? newValue.format("YYYY-MM-DD") : ""
            )
          }
          slotProps={{
            textField: { size: "small", sx: { minWidth: 140 } }
          }}
        />

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
        <Tooltip title="Registrar nueva venta" arrow>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddVenta}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.2,
              boxShadow: "none",

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Nueva Venta
          </Button>
        </Tooltip>
    </Box>
  );
};

export default VentaSearchBar;


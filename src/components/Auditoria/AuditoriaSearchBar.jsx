import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
} from "@mui/material";

import { Search } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableViewIcon from "@mui/icons-material/TableView";
import { CircularProgress } from "@mui/material";

const MODULOS = [
  "PRODUCTO",
  "VENTA",
  "CLIENTE",
  "INVENTARIO",
  "CAJA",
  "USUARIO",
  "CATEGORIA",
  "EMPRESA",
  "MOVIMIENTO CAJA",
];

const ACCIONES = [
  "CREAR",
  "ACTUALIZAR",
  "DESACTIVAR",
  "ACTIVAR",
  "CAMBIAR METODO DE PAGO",
  "ACTUALIZAR STOCK MINIMO",
  "CIERRE FORZADO",
  "ACTUALIZAR LOGO",
  "ENTRADA",
  "SALIDA",
];

export default function AuditoriaSearchBar({
  filter,
  onFilterChange,

  advancedFilters,
  setAdvancedFilters,

  onExportExcel,
  onExportCSV,
  loadingExcel,
  loadingCSV,
}) {
  const handleChange = (field, value) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2,}}
    >
      {/* SEARCH GENERAL */}
      <TextField
        size="small"
        placeholder="Buscar usuario, módulo, acción..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        sx={{ minWidth: 260 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* MÓDULO */}
      <TextField
        select
        size="small"
        label="Módulo"
        value={advancedFilters.modulo || ""}
        onChange={(e) => handleChange("modulo", e.target.value)}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">Todos</MenuItem>
        {MODULOS.map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </TextField>

      {/* ACCIÓN */}
      <TextField
        select
        size="small"
        label="Acción"
        value={advancedFilters.accion || ""}
        onChange={(e) => handleChange("accion", e.target.value)}
        sx={{ minWidth: 220 }}
      >
        <MenuItem value="">Todas</MenuItem>
        {ACCIONES.map((a) => (
          <MenuItem key={a} value={a}>
            {a}
          </MenuItem>
        ))}
      </TextField>

      {/* FECHA INICIO */}
      <TextField
        type="date"
        size="small"
        label="Desde"
        InputLabelProps={{ shrink: true }}
        value={advancedFilters.fechaInicio || ""}
        onChange={(e) => handleChange("fechaInicio", e.target.value)}
        sx={{ minWidth: 160 }}
      />

      {/* FECHA FIN */}
      <TextField
        type="date"
        size="small"
        label="Hasta"
        InputLabelProps={{ shrink: true }}
        value={advancedFilters.fechaFin || ""}
        onChange={(e) => handleChange("fechaFin", e.target.value)}
        sx={{ minWidth: 160 }}
      />

      {/* EXPORTAR */}
      <Button
        variant="outlined"
        size="small"
        startIcon={
          loadingExcel ? (
            <CircularProgress size={14} />
          ) : (
            <FileDownloadIcon />
          )
        }
        onClick={onExportExcel}
        disabled={loadingExcel}
      >
        Excel
      </Button>

      <Button
        variant="outlined"
        size="small"
        startIcon={
          loadingCSV ? <CircularProgress size={14} /> : <TableViewIcon />
        }
        onClick={onExportCSV}
        disabled={loadingCSV}
      >
        CSV
      </Button>
    </Box>
  );
}
import React, {useState, useEffect} from "react";
import { 
  Box, Chip, TextField, InputAdornment, Button, IconButton,
  Menu, MenuItem, Checkbox, FormControlLabel, Select, FormControl, 
  InputLabel, Autocomplete,
  Tooltip
} from "@mui/material";
import { Add, Search, Settings } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableViewIcon    from "@mui/icons-material/TableView";
import { CircularProgress } from "@mui/material";

const SORT_FIELDS = [
  { value: "nombre", label: "Nombre Producto" },
  { value: "categoria", label: "Categoria" },
  { value: "descripcion", label: "Descripcion"},
];

const ProductSearchBar = ({ 
  filter, onFilterChange, onAdd, showInactive, onToggleInactive,
  visibleColumns, setVisibleColumns,
  sortBy, setSortBy,
  advancedFilters, setAdvancedFilters, handleShowAll, ALL_COLUMNS, 
  categorias, onEditCategoria, onAddCategoria,
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
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        alignItems: "center",
        flexWrap: "wrap",
        flex: 1,
      }}
    >
    <TextField
      size="small"
      sx={{ minWidth: 260 }}
      placeholder="Buscar producto..."
      value={filter}
      onChange={(e) => onFilterChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
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
        sx: { width: 240, paddingY: 1 }
      }}
    >
    {/* Título */}
    <MenuItem disableRipple sx={{ opacity: 0.7, fontWeight: "bold", cursor: "default" }}>
      Columnas visibles
    </MenuItem>

    {/* Botón: Mostrar todas */}
    <MenuItem onClick={handleShowAll}>
      <FormControlLabel
        control={<Checkbox 
          checked={
            Object.values(visibleColumns).every(v => v === true)
          } 
        />}
        label="Mostrar todas"
      />
    </MenuItem>

    {/* Divider */}
    <Box sx={{ borderTop: "1px solid #ddd", marginY: 1 }} />

    {/* Lista de columnas */}
    {Object.keys(visibleColumns).map((k) => (
      <MenuItem key={k} onClick={() => toggleColumn(k)}>
        <FormControlLabel
          control={<Checkbox checked={!!visibleColumns[k]} />}
          label={ALL_COLUMNS[k]}   // ← ¡Ahora aparece bonito!
        />
      </MenuItem>
    ))}
  </Menu>

    {/* Filtros rápidos */}
    <Autocomplete
      size="small"
      options={categorias}               // Lista de categorías
      getOptionLabel={(option) => option.nombre}   // Qué mostrar
      isOptionEqualToValue={(option, value) => option.idCategoria === value.idCategoria}
      value={categorias.find(c => Number(c.idCategoria) === Number(advancedFilters.categoria)) || null}
      onChange={(e, newValue) =>
        handleAdvFilterChange("categoria", newValue ? newValue.idCategoria : "")
      }
      renderInput={(params) => (
        <TextField {...params} label="Categoría" />
      )}
      sx={{ minWidth: 200 }}
      renderOption={(props, option) => (
      <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {option.nombre}
        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation(); // Evita que se seleccione la opción al hacer clic en el icono
            onEditCategoria(option); // Llama a tu función de edición con la categoría
          }}
          aria-label={`editar ${option.nombre}`}
        >
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      )}
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
  </Box>
      {/* Botones */}
      <Tooltip title="Agregar nueva categoria" arrow>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddCategoria}
        >
          Agregar Categoria
        </Button>
      </Tooltip>
      <Tooltip title="Agregar nuevo producto" arrow>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
        >
          Agregar Producto
        </Button>
      </Tooltip>
    </Box>
);
};

export default ProductSearchBar;

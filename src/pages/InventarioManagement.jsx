import {
  Box, Typography, Card,
  TextField, Button, Autocomplete,
  Chip, Dialog, DialogContent, DialogActions, DialogTitle,
  ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import {
  Inventory2 as InventoryIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Edit
} from "@mui/icons-material";
import { useState, useRef } from "react";
import { useInventarioManagement } from "../hooks/inventario/useInventarioManagement";
import InventarioGrid              from "../components/Inventario/InventarioGrid";
import MovimientosGrid             from "../components/Inventario/MovimientosGrid";
import DialogRegistrarMovimiento   from "../components/Inventario/DialogRegistrarMovimiento";
import { styles }                  from "../styles/inventario/stylesInventario";

export default function InventarioManagement() {
  const {
    productos, movimientos, movimientoSeleccionado,
    lowStockProducts, inventarioFiltrado,
    pageInv, setPageInv, pageMov, setPageMov, totalRowsMov,
    filtroMov, setFiltroMov, tipoFiltro, setTipoFiltro, 
    productoSeleccionado, setProductoSeleccionado,
    tipoMovimiento, setTipoMovimiento,
    cantidad, setCantidad, motivo, setMotivo,
    loadingMovimiento, openDetalle, setOpenDetalle,
    handleRowClick, showOnlyLowStock, setShowOnlyLowStock,
    handleRegistrarMovimiento,handleUpdateStockMinimo,handleSearchMovimientos, filtroInv,
    setFiltroInv, 
  } = useInventarioManagement();

  // ── Estado local de la página ────────────────────────────────────
  const [vistaActiva, setVistaActiva]     = useState("stock");    // "stock" | "historial"
  const [openDialogMov, setOpenDialogMov] = useState(false);
  const [openEditStock, setOpenEditStock] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [nuevoStockMinimo, setNuevoStockMinimo] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const debounceRef = useRef(null);

  const handleOpenEditStock = (producto) => {
    setProductoEditando(producto);
    setNuevoStockMinimo(producto.stockMinimo || "");
    setOpenEditStock(true);
  };

  return (
    <Box sx={styles.page}>

      {/* ── Header con acciones ── */}
      <Box sx={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", flexWrap: "wrap",
        gap: 2, mb: 3,
      }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Gestión de Inventario
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Controla el stock y los movimientos de tus productos
          </Typography>
        </Box>

        {/* ✅ Botón para abrir el dialog de registro */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialogMov(true)}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Registrar movimiento
        </Button>
      </Box>

      {/* ── Banner stock bajo ── */}
      {lowStockProducts.length > 0 && (
        <Box sx={styles.banner}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <WarningIcon sx={{ color: "#f9a825", fontSize: 26 }} />
            <Box>
              <Typography fontWeight={700} color="#7c5700" fontSize={14}>
                {lowStockProducts.length}{" "}
                {lowStockProducts.length === 1
                  ? "producto con stock bajo o agotado"
                  : "productos con stock bajo o agotado"}
              </Typography>
              <Typography fontSize={12} color="#a07030">
                Revisa y ajusta el inventario para evitar quiebres de stock
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            variant="contained"
            sx={{ backgroundColor: "#f9a825", "&:hover": { backgroundColor: "#f59f00" } }}
            onClick={() => {
              setShowOnlyLowStock(true);
              setVistaActiva("stock"); // lleva al stock si está en historial
            }}
          >
            Ver productos
          </Button>
        </Box>
      )}

      {/* ── Toggle de vista ── */}
      <Box sx={{ display: "flex", alignItems: "center",
        justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>

        <ToggleButtonGroup
          value={vistaActiva}
          exclusive
          onChange={(_, val) => { if (val) setVistaActiva(val); }}
          size="small"
          sx={{ "& .MuiToggleButton-root": { px: 2.5, fontWeight: 600, borderRadius: "8px !important" } }}
        >
          <ToggleButton value="stock">
            <InventoryIcon sx={{ fontSize: 16, mr: 0.8 }} />
            Stock actual
            {lowStockProducts.length > 0 && (
              <Chip
                label={lowStockProducts.length}
                color="error"
                size="small"
                sx={{ ml: 1, height: 18, fontSize: "0.65rem" }}
              />
            )}
          </ToggleButton>
          <ToggleButton value="historial">
            <HistoryIcon sx={{ fontSize: 16, mr: 0.8 }} />
            Historial
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Botón "Mostrar todos" solo en vista stock con filtro activo */}
        {vistaActiva === "stock" && showOnlyLowStock && (
          <Button size="small" variant="outlined"
            onClick={() => setShowOnlyLowStock(false)}>
            Mostrar todos los productos
          </Button>
        )}
      </Box>

      {/* ── Vista Stock actual ── */}
      {vistaActiva === "stock" && (
        <Card elevation={0} sx={styles.card}>
          <Box sx={styles.cardHeader}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" fontWeight={700}>
                {showOnlyLowStock ? "Productos con stock bajo" : "Inventario actual"}
              </Typography>
              {lowStockProducts.length > 0 && (
                <Chip label={`${lowStockProducts.length} bajo stock`}
                  color="error" size="small" sx={{ fontSize: "0.68rem" }} />
              )}
            </Box>
          </Box>
          <Box sx={{ px: 2.5, pt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre o código de barras..."
              value={filtroInv.texto}
              onChange={(e) =>
                setFiltroInv({ ...filtroInv, texto: e.target.value })
              }
            />
          </Box>
            <InventarioGrid
              rows={inventarioFiltrado}
              page={pageInv}
              onPageChange={setPageInv}
              onEditStockMinimo={handleOpenEditStock}
            />
        </Card>
      )}

      {/* ── Vista Historial ── */}
      {vistaActiva === "historial" && (
        <Card elevation={0} sx={styles.card}>
          <Box sx={styles.cardHeader}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HistoryIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" fontWeight={700}>
                Historial de movimientos
              </Typography>
            </Box>
          </Box>
          <Box sx={{ px: 2.5, pt: 2 }}>
            {/* Filtros */}
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap",
              alignItems: "center", mb: 2 }}>
               <TextField
                  label="Buscar por nombre o código de barras"
                  size="small"
                  fullWidth
                  value={busquedaProducto}
                  onChange={(e) => {
                    setBusquedaProducto(e.target.value);       // actualiza el input visualmente ya
                    handleSearchMovimientos(e.target.value);   // debounce → llama al backend
                  }}
                />
              <Box sx={{ display: "flex", gap: 0.8 }}>
                {["", "ENTRADA", "SALIDA", "VENTA"].map((tipo) => (
                  <Chip
                    key={tipo}
                    label={tipo || "Todos"}
                    size="small"
                    clickable
                    color={tipoFiltro === tipo ? "primary" : "default"}
                    variant={tipoFiltro === tipo ? "filled" : "outlined"}
                    onClick={() => setTipoFiltro(tipo)}
                  />
                ))}
              </Box>
              <TextField
                type="date" size="small" label="Desde"
                InputLabelProps={{ shrink: true }}
                value={filtroMov.fechaInicio}
                onChange={(e) => setFiltroMov({ ...filtroMov, fechaInicio: e.target.value })}
              />
              <TextField
                type="date" size="small" label="Hasta"
                InputLabelProps={{ shrink: true }}
                value={filtroMov.fechaFin}
                onChange={(e) => setFiltroMov({ ...filtroMov, fechaFin: e.target.value })}
              />
            </Box>
          </Box>
          <MovimientosGrid
            rows={movimientos}
            totalRows={totalRowsMov}
            onRowClick={handleRowClick}
            page={pageMov}
            onPageChange={setPageMov}
          />
        </Card>
      )}

      {/* ── Dialog: Registrar movimiento ── */}
      <DialogRegistrarMovimiento
        open={openDialogMov}
        onClose={() => setOpenDialogMov(false)}
        productos={productos}
        productoSeleccionado={productoSeleccionado}
        setProductoSeleccionado={setProductoSeleccionado}
        tipoMovimiento={tipoMovimiento}
        setTipoMovimiento={setTipoMovimiento}
        cantidad={cantidad}
        setCantidad={setCantidad}
        motivo={motivo}
        setMotivo={setMotivo}
        loadingMovimiento={loadingMovimiento}
        handleRegistrarMovimiento={handleRegistrarMovimiento}
      />

      {/* ── Dialog: Detalle movimiento ── */}
      <Dialog
        open={openDetalle}
        onClose={() => setOpenDetalle(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid",
          borderColor: "divider", display: "flex",
          alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Detalle del movimiento
          </Typography>
          {movimientoSeleccionado?.tipo && (
            <Chip
              label={movimientoSeleccionado.tipo}
              size="small"
              color={
                movimientoSeleccionado.tipo === "ENTRADA" ? "success"
                : movimientoSeleccionado.tipo === "SALIDA"  ? "error"
                : "info"
              }
            />
          )}
        </Box>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={styles.detailGrid}>
            {[
              { label: "Producto", value: movimientoSeleccionado?.nombreProducto },
              { label: "Cantidad", value: movimientoSeleccionado?.cantidad },
              { label: "Tipo",     value: movimientoSeleccionado?.tipo },
              { label: "Fecha",    value: movimientoSeleccionado?.fecha
                  ? new Date(movimientoSeleccionado.fecha).toLocaleString("es-CO")
                  : "—" },
            ].map(({ label, value }) => (
              <Box key={label} sx={styles.detailItem}>
                <Typography variant="caption" fontWeight={700} color="text.disabled"
                  textTransform="uppercase" letterSpacing="0.07em" display="block">
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600} mt={0.3}>
                  {value ?? "—"}
                </Typography>
              </Box>
            ))}
            <Box sx={{ ...styles.detailItem, gridColumn: "1 / -1" }}>
              <Typography variant="caption" fontWeight={700} color="text.disabled"
                textTransform="uppercase" letterSpacing="0.07em" display="block">
                Motivo
              </Typography>
              <Typography variant="body2" fontWeight={600} mt={0.3}>
                {movimientoSeleccionado?.motivo ?? "—"}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
          <Button onClick={() => setOpenDetalle(false)} variant="outlined" size="small">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEditStock}
        onClose={() => setOpenEditStock(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Editar stock mínimo
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" mb={1}>
            Producto: <strong>{productoEditando?.nombre}</strong>
          </Typography>

          <TextField
            label="Nuevo stock mínimo"
            type="number"
            fullWidth
            value={nuevoStockMinimo}
            onChange={(e) => setNuevoStockMinimo(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEditStock(false)}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={async () => {
              await handleUpdateStockMinimo(
                productoEditando,
                Number(nuevoStockMinimo)
              );
              setOpenEditStock(false);
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
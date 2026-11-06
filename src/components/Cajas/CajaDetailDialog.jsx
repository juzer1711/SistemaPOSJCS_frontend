import {
  Dialog, DialogContent, DialogActions,
  Typography, IconButton, Box, Grid,
  Divider, Button, Table, TableHead,
  TableRow, TableCell, TableBody, Chip,
} from "@mui/material";
import {
  Close      as CloseIcon,
  Visibility as VisibilityIcon,
  PointOfSale as CajaIcon,
  Person      as PersonIcon,
  Receipt     as ReceiptIcon,
  SwapHoriz   as MovIcon,
} from "@mui/icons-material";
import { useCajaDetail }    from "../../hooks/cajas/useCajaDetail";
import VentaDetailDialog    from "../Ventas/VentaDetailDialog";
import { formatDateTime, formatMoney } from "../../utils/formats";
import { styles }           from "../../styles/cajas/stylesCaja";
import { Edit } from "@mui/icons-material";
import ConfirmDialog from "../ConfirmDialog";

// ── Tarjeta de stat reutilizable ──────────────────────────────────────
const StatCard = ({ label, value, color }) => (
  <Box sx={styles.statCard(color)}>
    <Typography variant="caption" fontWeight={700} color="text.disabled"
      textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.5}>
      {label}
    </Typography>
    <Typography variant="h6" fontWeight={800}
      color={color ? `${color}.dark` : "text.primary"}>
      {value}
    </Typography>
  </Box>
);

export default function CajaDetailDialog({ open, onClose, caja }) {
  const {
    ventas, loadingVentas, ventaSeleccionada, ventaOpen, setVentaOpen,
    movimientos, verDetalleVenta, dialogOpen, setDialogOpen, dialogInfo, handleConfirm,
    solicitarCambioMetodoPago, diferenciaEfectivo, diferenciaTransferencia,
  } = useCajaDetail({ open, caja });

  if (!caja) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: "90vh" } }}>

      {/* ── Header ── */}
      <Box sx={{
        px: 3, py: 2,
        background: "linear-gradient(135deg, #1565c0, #1976d2)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <CajaIcon sx={{ color: "white", fontSize: 24 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="white">
              Caja #{caja.idCaja} — Detalle completo
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
              {caja.estadoCaja === "ABIERTA" ? "🟢 Aún abierta" : "🔴 Cerrada"}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>

        {/* ── Info general ── */}
        <Box sx={styles.detailSection}>
          <Typography sx={styles.sectionLabel}>
            <PersonIcon fontSize="small" /> Información general
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "Cajero",    value: caja.nombreCajero },
              { label: "Apertura",  value: formatDateTime(caja.fechaApertura) },
              { label: "Cierre",    value: caja.fechaCierre ? formatDateTime(caja.fechaCierre) : "Aún abierta" },
              { label: "Estado",    value: caja.estadoCaja },
            ].map(({ label, value }) => (
              <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 1.5, backgroundColor: "background.default",
                  borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="caption" color="text.disabled"
                    fontWeight={700} textTransform="uppercase"
                    letterSpacing="0.07em" display="block">
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} mt={0.3}>
                    {value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* ── Totales sistema ── */}
        <Box sx={styles.detailSection}>
          <Typography sx={styles.sectionLabel}>
            <ReceiptIcon fontSize="small" /> Totales del sistema
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard label="Monto inicial"    value={formatMoney(caja.montoInicial)} />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard label="Total ventas"     value={formatMoney(caja.totalVentas)}  color="primary" />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard label="Efectivo sistema" value={formatMoney(caja.totalEfectivo)} />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard label="Transfer. sistema" value={formatMoney(caja.totalTransferencia)} />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* ── Conteo real + diferencias ── */}
        <Box sx={styles.detailSection}>
          <Typography sx={styles.sectionLabel}>
            Conteo real del cajero
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard label="Efectivo contado"  value={formatMoney(caja.efectivoReal ?? 0)} />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard label="Transfer. contada" value={formatMoney(caja.transferenciaReal ?? 0)} />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={styles.statCard(diferenciaEfectivo === 0 ? "success" : "error")}>
                <Typography variant="caption" fontWeight={700} color="text.disabled"
                  textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.5}>
                  Dif. Efectivo
                </Typography>
                <Chip
                  label={formatMoney(diferenciaEfectivo)}
                  size="small"
                  sx={styles.diffChip(diferenciaEfectivo)}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={styles.statCard(diferenciaTransferencia === 0 ? "success" : "error")}>
                <Typography variant="caption" fontWeight={700} color="text.disabled"
                  textTransform="uppercase" letterSpacing="0.08em" display="block" mb={0.5}>
                  Dif. Transferencia
                </Typography>
                <Chip
                  label={formatMoney(diferenciaTransferencia)}
                  size="small"
                  sx={styles.diffChip(diferenciaTransferencia)}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* ── Ventas ── */}
        <Box sx={styles.detailSection}>
          <Typography sx={styles.sectionLabel}>
            <ReceiptIcon fontSize="small" /> Ventas realizadas
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": {
                fontSize: "0.72rem", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.06em",
                color: "text.disabled", backgroundColor: "background.default",
              }}}>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingVentas ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", color: "text.secondary", py: 3 }}>
                    Cargando ventas...
                  </TableCell>
                </TableRow>
              ) : ventas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", color: "text.disabled", py: 3 }}>
                    No hay ventas registradas en esta caja
                  </TableCell>
                </TableRow>
              ) : ventas.map((venta) => (
                <TableRow key={venta.idVenta}
                  sx={{ "&:hover": { backgroundColor: "background.default" } }}>
                  <TableCell>
                    <Chip label={`#${venta.idVenta}`} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.82rem" }}>
                    {formatDateTime(venta.fecha)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={venta.metodoPago}
                      size="small"
                      color={venta.metodoPago === "EFECTIVO" ? "success" : "info"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {formatMoney(venta.total)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => verDetalleVenta(venta.idVenta)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => solicitarCambioMetodoPago(venta)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* ── Movimientos ── */}
        <Box>
          <Typography sx={styles.sectionLabel}>
            <MovIcon fontSize="small" /> Movimientos de caja
          </Typography>
          {movimientos.length === 0 ? (
            <Typography variant="body2" color="text.disabled"
              sx={{ textAlign: "center", py: 3 }}>
              No hay movimientos manuales registrados en esta caja
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": {
                  fontSize: "0.72rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  color: "text.disabled", backgroundColor: "background.default",
                }}}>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Motivo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movimientos.map((m) => (
                  <TableRow key={m.idMovimiento}
                    sx={{ "&:hover": { backgroundColor: "background.default" } }}>
                    <TableCell sx={{ fontSize: "0.82rem" }}>
                      {formatDateTime(m.fecha)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={m.tipo}
                        color={m.tipo === "ENTRADA" ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {formatMoney(m.monto)}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                      {m.motivo || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{
        px: 3, py: 2,
        borderTop: "1px solid", borderColor: "divider",
      }}>
        <Button onClick={onClose} variant="outlined">Cerrar</Button>
      </DialogActions>

      {ventaSeleccionada && (
        <VentaDetailDialog
          open={ventaOpen}
          onClose={() => setVentaOpen(false)}
          venta={ventaSeleccionada}
        />
      )}
      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
        title={dialogInfo.title}
        message={dialogInfo.message}
        confirmText={dialogInfo.confirmText}
        confirmColor={dialogInfo.confirmColor}
      />
    </Dialog>
    
  );
}
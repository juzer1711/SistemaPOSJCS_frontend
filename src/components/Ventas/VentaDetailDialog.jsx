import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, Divider, Box, Paper,
} from "@mui/material";
import {
  Print as PrintIcon,
} from "@mui/icons-material";
import { useEmpresa } from "../../context/EmpresaContext";
import TicketContent, { normalizeItemsParaTicket } from "../TicketContent";

const VentaDetailDialog = ({ open, onClose, venta }) => {
  const { empresa } = useEmpresa();

  if (!venta) return null;

  const clienteAdaptado = {
    razonSocial:   venta.nombreCliente,
    documento:     venta.documentoCliente,
    tipoDocumento: venta.tipoDocumento,
  };

  const itemsNormalizados = normalizeItemsParaTicket(venta.items);

  const handlePrint = () => {
    const printContents = document.getElementById("ticket-print").innerHTML;
    const win = window.open("", "_blank", "width=420,height=700");
    win.document.write(`
      <html>
        <head>
          <title>Ticket · ${empresa?.nombreComercial}</title>
          <style>
            body { font-family: monospace; padding: 16px; width: 360px; margin: 0 auto; }
            hr   { border: none; border-top: 1px dashed #000; margin: 6px 0; }
            div  { margin: 1px 0; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: { xs: "95vw", md: 780 },
          borderRadius: "24px",
          overflow: "hidden",
        }
      }}
    >
      {/* ENCABEZADO */}
      <DialogTitle
        sx={{
          px: 3, py: 2.5,
          borderBottom: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#0F172A">
          Detalle de Venta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Factura #{venta.idVenta}
        </Typography>
      </DialogTitle>

      {/* BODY: dos columnas */}
      <DialogContent
        dividers
        sx={{
          p: 0,
          display: "flex",
          backgroundColor: "#F8FAFC",
          minHeight: 420,
        }}
      >
        {/* ── Columna izquierda: contenido original ── */}
        <Box sx={{ flex: 1, px: 3, py: 3, overflowY: "auto" }}>

          {/* INFO CLIENTE */}
          <Paper elevation={0} sx={{
            p: 2.5, mb: 3, borderRadius: "20px",
            border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", textAlign: "center",
          }}>
            <Typography fontWeight="bold" fontSize={17}>{venta.nombreCliente}</Typography>
            <Typography fontSize={14} color="text.secondary">
              Documento: {venta.documentoCliente}
            </Typography>
            <Typography fontSize={14} color="text.secondary">
              Fecha: {new Date(venta.fecha).toLocaleString()}
            </Typography>
            <Typography fontSize={14} color="text.secondary">
              Pago: {venta.metodoPago}
            </Typography>
            {venta.observaciones && (
              <Typography fontStyle="italic" fontSize={13} sx={{ mt: 1 }}>
                "{venta.observaciones}"
              </Typography>
            )}
          </Paper>

          <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

          {/* TABLA PRODUCTOS */}
          <Typography fontWeight="bold" sx={{ mb: 1 }}>Productos</Typography>
          <Table size="small" sx={{ backgroundColor: "#FFFFFF", borderRadius: "16px", overflow: "hidden" }}>
            <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
              <TableRow>
                <TableCell><b>Producto</b></TableCell>
                <TableCell align="center"><b>Cant</b></TableCell>
                <TableCell align="right"><b>Total</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {venta.items.map((item, i) => (
                <TableRow key={i} sx={{ "& td": { borderBottom: "1px solid #F1F5F9" } }}>
                  <TableCell>
                    {item.nombreProducto}
                    <Typography fontSize={12} color="text.secondary">
                      PU: ${item.precioUnitario?.toLocaleString("es-CO")}
                      &nbsp;| IVA: {(item.ivaPorcentaje * 100)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{item.cantidad}</TableCell>
                  <TableCell align="right">
                    <b>${item.subtotal?.toLocaleString("es-CO")}</b>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ borderStyle: "dashed", my: 2 }} />

          {/* TOTALES */}
          <Paper elevation={0} sx={{
            p: 3, borderRadius: "20px",
            backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0",
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Total sin IVA:</Typography>
              <Typography>${venta.totalSinIVA?.toLocaleString("es-CO")}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>IVA:</Typography>
              <Typography>${venta.totalIVA?.toLocaleString("es-CO")}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h6" fontWeight="bold">Total pagado:</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${venta.total?.toLocaleString("es-CO")}
              </Typography>
            </Box>
            {venta.metodoPago === "EFECTIVO" && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>Monto recibido:</Typography>
                  <Typography>${venta.montoRecibido?.toLocaleString("es-CO")}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Cambio:</Typography>
                  <Typography color="green" fontWeight="bold">
                    ${venta.cambio?.toLocaleString("es-CO")}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>

          <Divider sx={{ borderStyle: "dashed", mt: 2 }} />
          <Typography textAlign="center" fontSize={13} color="text.secondary" sx={{ mt: 1 }}>
            Gracias por su compra
          </Typography>
        </Box>

        {/* ── Columna derecha: ticket térmico ── */}
        <Box
          sx={{
            width: 240,
            borderLeft: "1px solid #E2E8F0",
            backgroundColor: "#f0f0f0",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            gap: 1,
            overflowY: "auto",
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.disabled"
            textTransform="uppercase" letterSpacing="0.08em">
            Preview ticket
          </Typography>

          {/* Borde dentado arriba */}
          <Box sx={{
            width: "100%", height: 8,
            backgroundImage: "radial-gradient(circle, #f0f0f0 6px, #fff 6px)",
            backgroundSize: "14px 8px", backgroundRepeat: "repeat-x",
          }} />

          <Box sx={{
            backgroundColor: "white", width: "100%",
            px: 2, py: 1.5, boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          }}>
            <TicketContent
              cliente={clienteAdaptado}
              metodoPago={venta.metodoPago}
              items={itemsNormalizados}
              total={venta.total}
              totalIVA={venta.totalIVA}
              totalSinIVA={venta.totalSinIVA}
              montoRecibido={venta.montoRecibido}
              cambio={venta.cambio}
              cajaActiva={{ idCaja: venta.idCaja }}
              fechaVenta={venta.fecha}
            />
          </Box>

          {/* Borde dentado abajo */}
          <Box sx={{
            width: "100%", height: 8,
            backgroundImage: "radial-gradient(circle, #f0f0f0 6px, #fff 6px)",
            backgroundSize: "14px 8px", backgroundRepeat: "repeat-x",
            transform: "rotate(180deg)",
          }} />
        </Box>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions sx={{
        px: 3, py: 2,
        borderTop: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF",
        justifyContent: "space-between",
      }}>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 600, px: 3 }}
        >
          Reimprimir ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VentaDetailDialog;
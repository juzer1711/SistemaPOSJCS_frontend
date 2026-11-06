import { Box } from "@mui/material";
import { useEmpresa } from "../context/EmpresaContext";

const getClientName = (c) =>
  c?.razonSocial ?? `${c?.primerNombre ?? ""} ${c?.primerApellido ?? ""}`.trim();

const fmt = (n) => Number(n ?? 0).toLocaleString("es-CO");

const getNow = () => {
  const d = new Date();
  return {
    fecha: d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" }),
    hora: d.toLocaleTimeString("es-CO"),
  };
};

// ──────────────────────────────────────────────────────────────
// items deben tener forma normalizada:
//   { idProducto, nombre, cantidad, precioUnitario }
// Usá normalizeItemsParaTicket() antes de pasarlos
// ──────────────────────────────────────────────────────────────
const TicketContent = ({
  cliente, metodoPago, items, total,
  totalIVA, totalSinIVA, montoRecibido, cambio,
  cajaActiva, fechaVenta,           // ← opcional: si viene del historial
}) => {
  const { empresa } = useEmpresa();
  const { fecha, hora } = fechaVenta
    ? {
        fecha: new Date(fechaVenta).toLocaleDateString("es-CO",
          { day: "2-digit", month: "2-digit", year: "numeric" }),
        hora: new Date(fechaVenta).toLocaleTimeString("es-CO"),
      }
    : getNow();

  const cajero  = localStorage.getItem("username") ?? "";
  const idCaja  = cajaActiva?.idCaja ?? "—";

  return (
    <Box
      id="ticket-print"
      sx={{ fontFamily: "monospace", fontSize: "11px", width: "100%", lineHeight: 1.6 }}
    >
      <Box sx={{ textAlign: "center", mb: 0.5 }}>
        <div style={{ fontWeight: "bold", fontSize: 13 }}>{empresa?.nombreComercial}</div>
        <div>NIT: {empresa?.nit}</div>
        <div>Tel: {empresa?.telefono}</div>
        <div>{empresa?.direccion}</div>
      </Box>

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      <Box sx={{ textAlign: "center", mb: 0.5 }}>
        <div style={{ fontWeight: "bold" }}>COMPROBANTE DE VENTA</div>
        <div>{fecha} {hora}</div>
        <div>Caja #{idCaja} · {cajero}</div>
      </Box>

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Cliente:</span><span>{getClientName(cliente)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Doc:</span><span>{cliente?.documento}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Pago:</span><span>{metodoPago}</span>
      </div>

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      {items.map((i) => (
        <div key={i.idProducto ?? i.nombreProducto}
          style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ maxWidth: "65%", overflow: "hidden" }}>
            {i.nombre} x{i.cantidad}
          </span>
          <span>${fmt(i.precioUnitario * i.cantidad)}</span>
        </div>
      ))}

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Subtotal:</span><span>${fmt(totalSinIVA)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>IVA:</span><span>${fmt(totalIVA)}</span>
      </div>

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between",
        fontWeight: "bold", fontSize: 13 }}>
        <span>TOTAL:</span><span>${fmt(total)}</span>
      </div>

      {metodoPago === "EFECTIVO" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Recibido:</span><span>${fmt(montoRecibido)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Cambio:</span><span>${fmt(cambio)}</span>
          </div>
        </>
      )}

      <hr style={{ border: "none", borderTop: "1px dashed #000", margin: "6px 0" }} />

      <Box sx={{ textAlign: "center" }}>
        <div>¡Gracias por su compra!</div>
        <div>Vuelva pronto</div>
      </Box>
    </Box>
  );
};

// ── Normaliza items del historial al formato que espera TicketContent
export const normalizeItemsParaTicket = (items = []) =>
  items.map((i) => ({
    idProducto:     i.idProducto ?? i.nombreProducto,
    nombre:         i.nombre ?? i.nombreProducto,
    cantidad:       i.cantidad,
    // Si viene subtotal del historial, derivamos precioUnitario
    precioUnitario: i.precioUnitario ?? (i.subtotal / i.cantidad),
  }));

export default TicketContent;
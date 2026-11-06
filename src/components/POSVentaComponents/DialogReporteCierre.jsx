import { Dialog, DialogContent, Button, Box, Typography } from "@mui/material";
import { formatDateTime, formatMoney } from "../../utils/formats";

// ─── Genera el HTML limpio de la tirilla para imprimir ────────────────────────
const buildPrintHTML = (reporte) => {
  const difEfectivo = Number(reporte.diferenciaEfectivo || 0);
  const difTransfer = Number(reporte.diferenciaTransferencia || 0);
  const cierreOk = difEfectivo === 0 && difTransfer === 0;

  const row = (label, value, bold = false) =>
    `<div class="row${bold ? " bold" : ""}"><span>${label}</span><span>${value}</span></div>`;

  const diffRow = (label, value) => {
    const num = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    const cls = num === 0 ? "ok" : num > 0 ? "up" : "down";
    const prefix = num > 0 ? "▲" : num < 0 ? "▼" : "●";
    return `<div class="row diff ${cls}"><span>${label}</span><span>${prefix} ${value}</span></div>`;
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Cierre de Caja #${reporte.idCaja}</title>
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #fff;
      display: flex;
      justify-content: center;
      padding: 24px 0;
    }
    .ticket {
      width: 300px;
      background: #f5f0e8;
      font-family: 'Share Tech Mono', monospace;
      font-size: 11.5px;
      color: #2a2a2a;
      padding: 16px 20px;
    }
    .header { text-align: center; margin-bottom: 14px; }
    .header .store { font-size: 17px; font-weight: 700; letter-spacing: 3px; }
    .header .subtitle { font-size: 9px; letter-spacing: 4px; color: #777; text-transform: uppercase; margin-top: 2px; }
    .badge {
      display: inline-block;
      margin-top: 10px;
      padding: 3px 12px;
      border: 1.5px solid ${cierreOk ? "#2e7d32" : "#c62828"};
      border-radius: 3px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 3px;
      color: ${cierreOk ? "#2e7d32" : "#c62828"};
    }
    .divider { border-top: 1.5px dashed #bbb; margin: 10px 0; }
    .section-title {
      font-size: 9px;
      letter-spacing: 2px;
      color: #888;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .section { margin-bottom: 4px; }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .row.bold { font-weight: 700; }
    .row.diff.ok   { color: #2e7d32; font-weight: 700; }
    .row.diff.up   { color: #1565c0; font-weight: 700; }
    .row.diff.down { color: #c62828; font-weight: 700; }
    .footer { text-align: center; margin-top: 10px; color: #aaa; font-size: 9px; letter-spacing: 1px; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <div class="store">MI PAPELERÍA</div>
      <div class="subtitle">Reporte de Cierre</div>
      <div class="badge">${cierreOk ? "✓ CIERRE OK" : "⚠ CON DIFERENCIAS"}</div>
    </div>

    <div class="divider"></div>

    <div class="section">
      <div class="section-title">── Identificación ──────────────</div>
      ${row("Caja", `#${reporte.idCaja}`)}
      ${row("Cajero", reporte.nombreCajero)}
      ${row("Apertura", formatDateTime(reporte.fechaApertura))}
      ${row("Cierre", formatDateTime(reporte.fechaCierre))}
    </div>

    <div class="divider"></div>

    <div class="section">
      <div class="section-title">── Sistema ──────────────────────</div>
      ${row("Monto inicial", formatMoney(reporte.montoInicial))}
      ${row("Ventas totales", formatMoney(reporte.totalVentas), true)}
      ${row("Efectivo", formatMoney(reporte.totalEfectivo))}
      ${row("Transferencia", formatMoney(reporte.totalTransferencia))}
    </div>

    <div class="divider"></div>

    <div class="section">
      <div class="section-title">── Conteo real ──────────────────</div>
      ${row("Efectivo", formatMoney(reporte.efectivoReal))}
      ${row("Transferencia", formatMoney(reporte.transferenciaReal))}
    </div>

    <div class="divider"></div>

    <div class="section">
      <div class="section-title">── Diferencias ──────────────────</div>
      ${diffRow("Efectivo", formatMoney(reporte.diferenciaEfectivo))}
      ${diffRow("Transferencia", formatMoney(reporte.diferenciaTransferencia))}
    </div>

    <div class="divider"></div>

    <div class="footer">
      <div>${formatDateTime(reporte.fechaCierre)}</div>
      <div style="margin-top:4px">···················</div>
    </div>
  </div>
  <script>
    window.onload = () => {
      window.print();
      window.onafterprint = () => window.close();
    };
  </script>
</body>
</html>`;
};

// ─── Separador tipo diente de sierra ─────────────────────────────────────────
const TornEdge = ({ flip = false }) => (
  <Box
    sx={{
      width: "100%",
      height: 10,
      backgroundImage: flip
        ? "radial-gradient(circle at 50% 0%, #f5f0e8 5px, transparent 5px)"
        : "radial-gradient(circle at 50% 100%, #f5f0e8 5px, transparent 5px)",
      backgroundSize: "12px 10px",
      backgroundRepeat: "repeat-x",
      backgroundPosition: flip ? "top" : "bottom",
    }}
  />
);

const DottedDivider = () => (
  <Box sx={{ borderTop: "1.5px dashed #bbb", my: 1.5 }} />
);

const TicketRow = ({ label, value, bold = false, large = false, color }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
    <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: large ? 13 : 11.5, fontWeight: bold ? 700 : 400, color: color || "#2a2a2a" }}>
      {label}
    </Typography>
    <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: large ? 14 : 11.5, fontWeight: bold ? 700 : 500, color: color || "#2a2a2a", ml: 1, flexShrink: 0 }}>
      {value}
    </Typography>
  </Box>
);

const DiffRow = ({ label, value }) => {
  const num = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  const color = num === 0 ? "#2e7d32" : num > 0 ? "#1565c0" : "#c62828";
  const prefix = num > 0 ? "▲" : num < 0 ? "▼" : "●";
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11.5, color }}>{label}</Typography>
      <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11.5, fontWeight: 700, color }}>{prefix} {value}</Typography>
    </Box>
  );
};

const TicketSection = ({ title, children }) => (
  <Box sx={{ mb: 0.5 }}>
    <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#888", textTransform: "uppercase", mb: 0.75 }}>
      ── {title} ──────────────────
    </Typography>
    {children}
  </Box>
);

// ─── Componente principal ──────────────────────────────────────────────────────
const DialogReporteCierre = ({ open, reporte, onClose }) => {

  // 👇 Abre ventana nueva con HTML limpio → imprime → se cierra sola
  const handlePrint = () => {
    const win = window.open("", "_blank", "width=420,height=700");
    if (!win) return;
    win.document.write(buildPrintHTML(reporte));
    win.document.close();
  };

  if (!reporte) return null;

  const difEfectivo = Number(reporte.diferenciaEfectivo || 0);
  const difTransfer = Number(reporte.diferenciaTransferencia || 0);
  const cierreOk = difEfectivo === 0 && difTransfer === 0;

  return (
    <Dialog open={open} maxWidth="xs" PaperProps={{ sx: { bgcolor: "transparent", boxShadow: "none" } }}>
      <DialogContent sx={{ p: 0, bgcolor: "transparent" }}>

        {/* ── Wrapper tirilla ── */}
        <Box sx={{ width: 300, mx: "auto", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.22))" }}>

          <Box sx={{ bgcolor: "#f5f0e8" }}><TornEdge flip /></Box>

          <Box sx={{ bgcolor: "#f5f0e8", px: 2.5, pb: 2, pt: 0.5 }}>

            <Box sx={{ textAlign: "center", mb: 2, mt: 1 }}>
              <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 17, fontWeight: 700, letterSpacing: 3, color: "#1a1a1a" }}>
                MI PAPELERÍA
              </Typography>
              <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: 4, color: "#777", textTransform: "uppercase", mt: 0.25 }}>
                Reporte de Cierre
              </Typography>
              <Box sx={{ mt: 1.5, display: "inline-block", px: 2, py: 0.4, border: "1.5px solid", borderColor: cierreOk ? "#2e7d32" : "#c62828", borderRadius: 0.5 }}>
                <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 3, fontWeight: 700, color: cierreOk ? "#2e7d32" : "#c62828" }}>
                  {cierreOk ? "✓ CIERRE OK" : "⚠ CON DIFERENCIAS"}
                </Typography>
              </Box>
            </Box>

            <DottedDivider />

            <TicketSection title="Identificación">
              <TicketRow label="Caja" value={`#${reporte.idCaja}`} />
              <TicketRow label="Cajero" value={reporte.nombreCajero} />
              <TicketRow label="Apertura" value={formatDateTime(reporte.fechaApertura)} />
              <TicketRow label="Cierre" value={formatDateTime(reporte.fechaCierre)} />
            </TicketSection>

            <DottedDivider />

            <TicketSection title="Sistema">
              <TicketRow label="Monto inicial" value={formatMoney(reporte.montoInicial)} />
              <TicketRow label="Ventas totales" value={formatMoney(reporte.totalVentas)} bold />
              <TicketRow label="Efectivo" value={formatMoney(reporte.totalEfectivo)} />
              <TicketRow label="Transferencia" value={formatMoney(reporte.totalTransferencia)} />
            </TicketSection>

            <DottedDivider />

            <TicketSection title="Conteo real">
              <TicketRow label="Efectivo" value={formatMoney(reporte.efectivoReal)} />
              <TicketRow label="Transferencia" value={formatMoney(reporte.transferenciaReal)} />
            </TicketSection>

            <DottedDivider />

            <TicketSection title="Diferencias">
              <DiffRow label="Efectivo" value={formatMoney(reporte.diferenciaEfectivo)} />
              <DiffRow label="Transferencia" value={formatMoney(reporte.diferenciaTransferencia)} />
            </TicketSection>

            <DottedDivider />

            <Box sx={{ textAlign: "center", mt: 1.5 }}>
              <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#aaa", letterSpacing: 1 }}>
                {formatDateTime(reporte.fechaCierre)}
              </Typography>
              <Typography sx={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#bbb", mt: 0.5 }}>
                ···················
              </Typography>
            </Box>
          </Box>

          <Box sx={{ bgcolor: "#f5f0e8" }}><TornEdge /></Box>
        </Box>

        {/* ── Botones ── */}
        <Box sx={{ width: 300, mx: "auto", mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handlePrint}
            sx={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1, mb: 1 }}
          >
            Imprimir / Guardar PDF
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}
          >
            Completar Cierre →
          </Button>
        </Box>

      </DialogContent>
    </Dialog>
  );
};

export default DialogReporteCierre;
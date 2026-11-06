import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, Divider, Grid, Alert
} from "@mui/material";
import { useState } from "react";

// ─── Barra de progreso personalizada ──────────────────────────────────────────
const StepProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Conteo" },
    { number: 2, label: "Cuadre" },
  ];

  return (
    <Box sx={{ px: 3, pt: 2, pb: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
        {/* línea de fondo gris */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "calc(50px / 2)",
            right: "calc(50px / 2)",
            height: 3,
            bgcolor: "#e0e0e0",
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />
        {/* línea de progreso activa */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "calc(50px / 2)",
            width: currentStep === 2 ? "calc(100% - 50px)" : "0%",
            height: 3,
            bgcolor: "primary.main",
            transform: "translateY(-50%)",
            zIndex: 1,
            transition: "width 0.4s ease",
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <Box
              key={step.number}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                zIndex: 2,
              }}
            >
              {/* círculo del paso */}
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  border: "3px solid",
                  transition: "all 0.3s ease",
                  borderColor: isCompleted || isActive ? "primary.main" : "#e0e0e0",
                  bgcolor: isCompleted
                    ? "primary.main"
                    : isActive
                    ? "primary.main"
                    : "#fff",
                  color: isCompleted || isActive ? "#fff" : "#bdbdbd",
                  boxShadow: isActive ? "0 0 0 4px rgba(25,118,210,0.15)" : "none",
                }}
              >
                {isCompleted ? "✓" : step.number}
              </Box>

              {/* etiqueta del paso */}
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? "primary.main" : "text.secondary",
                  transition: "all 0.3s ease",
                }}
              >
                {step.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// ─── Tarjeta de sección del cuadre ────────────────────────────────────────────
const CuadreSectionCard = ({ title, sistema, contado, diff }) => {
  const isMatch = diff === 0;
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: isMatch ? "success.light" : "error.light",
        borderRadius: 2,
        p: 2,
        bgcolor: isMatch ? "rgba(46,125,50,0.04)" : "rgba(211,47,47,0.04)",
      }}
    >
      {/* encabezado */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography fontWeight={700} fontSize={15}>
          {title}
        </Typography>
        <Box
          sx={{
            px: 1.5,
            py: 0.4,
            borderRadius: 10,
            bgcolor: isMatch ? "success.main" : "error.main",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {isMatch ? "Cuadra ✓" : `${diff > 0 ? "+" : ""}$${diff.toLocaleString()}`}
        </Box>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* fila sistema */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
        <Typography variant="body2" color="text.secondary">
          Sistema
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          ${sistema.toLocaleString()}
        </Typography>
      </Box>

      {/* fila contado */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Contado
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          ${contado.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

// ─── Componente principal ──────────────────────────────────────────────────────
const DialogCerrarCaja = ({ open, onClose, cajaActiva, onConfirm }) => {
  const [efectivoReal, setEfectivoReal] = useState("");
  const [transferenciaReal, setTransferenciaReal] = useState("");
  const [step, setStep] = useState(1);

  // 🔹 Valores del sistema
  const efectivoSistema = Number(cajaActiva?.totalEfectivo || 0);
  const transferenciaSistema = Number(cajaActiva?.totalTransferencia || 0);
  const montoInicial = Number(cajaActiva?.montoInicial || 0);

  const totalSistema = efectivoSistema + transferenciaSistema;
  const totalReal = Number(efectivoReal || 0) + Number(transferenciaReal || 0);

  const diffEfectivo = Number(efectivoReal || 0) - efectivoSistema;
  const diffTransferencia = Number(transferenciaReal || 0) - transferenciaSistema;
  const diffTotal = totalReal - totalSistema;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">

      {/* ── Header ── */}
      <DialogTitle sx={{ pb: 0 }}>
        <Typography variant="h6" fontWeight={700}>
          Cerrar Caja
        </Typography>
      </DialogTitle>

      {/* ── Barra de progreso ── */}
      <StepProgressBar currentStep={step} />

      <Divider />

      {/* ── Contenido ── */}
      <DialogContent sx={{ pt: 3 }}>

        {/* PASO 1 — CONTEO */}
        {step === 1 && (
          <>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Conteo real del cajero
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              El cuadre no contempla el monto inicial. La base debe ser exactamente
              la misma con la que se abrió la caja:{" "}
              <strong>${montoInicial.toLocaleString()}</strong>
            </Alert>

            <TextField
              label="Efectivo contado"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={efectivoReal}
              onChange={(e) => setEfectivoReal(e.target.value)}
            />

            <TextField
              label="Transferencia contada"
              type="number"
              fullWidth
              value={transferenciaReal}
              onChange={(e) => setTransferenciaReal(e.target.value)}
            />
          </>
        )}

        {/* PASO 2 — CUADRE */}
        {step === 2 && (
          <>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Cuadre contra el sistema
            </Typography>

            {/* Efectivo */}
            <CuadreSectionCard
              title="Efectivo"
              sistema={efectivoSistema}
              contado={Number(efectivoReal)}
              diff={diffEfectivo}
            />

            {/* Transferencia */}
            <Box sx={{ mt: 2 }}>
              <CuadreSectionCard
                title="Transferencia"
                sistema={transferenciaSistema}
                contado={Number(transferenciaReal)}
                diff={diffTransferencia}
              />
            </Box>

            {/* Total */}
            <Box
              sx={{
                mt: 2,
                border: "2px solid",
                borderColor: diffTotal === 0 ? "success.main" : "error.main",
                borderRadius: 2,
                p: 2,
                bgcolor: diffTotal === 0 ? "rgba(46,125,50,0.06)" : "rgba(211,47,47,0.06)",
              }}
            >
              <Typography fontWeight={700} fontSize={15} sx={{ mb: 1.5 }}>
                Resumen total
              </Typography>

              <Divider sx={{ mb: 1.5 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                <Typography variant="body2" color="text.secondary">
                  Sistema
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ${totalSistema.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Contado
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ${totalReal.toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ mb: 1.5 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontWeight={700} fontSize={15}>
                  Diferencia total
                </Typography>
                <Typography
                  fontWeight={800}
                  fontSize={17}
                  color={diffTotal === 0 ? "success.main" : "error.main"}
                >
                  {diffTotal > 0 ? "+" : ""}${diffTotal.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      {/* ── Acciones ── */}
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        {step === 1 && (
          <Button
            variant="contained"
            onClick={() => setStep(2)}
            disabled={!efectivoReal || !transferenciaReal}
          >
            Continuar al cuadre
          </Button>
        )}

        {step === 2 && (
          <>
            <Button onClick={() => setStep(1)}>
              Volver a contar
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={() => onConfirm(efectivoReal, transferenciaReal)}
            >
              Confirmar Cierre
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogCerrarCaja;
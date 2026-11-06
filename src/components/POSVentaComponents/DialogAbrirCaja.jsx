import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Alert, Stack
} from "@mui/material";
import { useEffect, useState } from "react";

const DialogAbrirCaja = ({
  open,
  onClose,
  onConfirm
}) => {

  const [montoInicial, setMontoInicial] = useState("");

  const montoNumerico = Number(montoInicial);
  const isValid = montoNumerico > 0;

  // 🔥 Limpia el input cuando se cierra el dialog (bug visual común)
  useEffect(() => {
    if (!open) setMontoInicial("");
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
    >
      <DialogTitle>Abrir Caja</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>

          <Alert severity="info">
            Este valor representa el <b>efectivo físico</b> con el que inicias tu turno.
            Será el punto de referencia para el cuadre al cerrar la caja.
          </Alert>

          <TextField
            label="Efectivo en caja"
            type="number"
            autoFocus
            fullWidth
            value={montoInicial}
            onChange={(e) => setMontoInicial(e.target.value)}
            error={montoInicial !== "" && !isValid}
            helperText={
              montoInicial
                ? `Monto ingresado: $${montoNumerico.toLocaleString("es-CO")}`
                : "Ingresa el dinero contado físicamente antes de empezar a vender"
            }
          />

        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!isValid}
          onClick={() => onConfirm(montoNumerico)}
        >
          Abrir Caja
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAbrirCaja;
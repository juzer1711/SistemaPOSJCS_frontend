import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  Button
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  confirmColor = "primary",
  onClose,
  onConfirm,
  pending = false,
  error = ""
}) {
  return (
    <Dialog open={open} onClose={pending ? undefined : onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={pending}>{cancelText}</Button>
        <Button
          onClick={onConfirm}
          disabled={pending}
          color={confirmColor}
          variant="contained"
        >
          {pending ? <CircularProgress size={20} aria-label="Guardando cambio" /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
    
  );
}

import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

export default function SuccessDialog({ open, message }) {
  return (
    <Dialog open={open}>
      <DialogTitle>✔ Operación exitosa</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
    </Dialog>
  );
}

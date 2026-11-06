import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const ChatMessage = ({ mensaje }) => {
  const esUsuario = mensaje.autor === "usuario";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: esUsuario ? "flex-end" : "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: { xs: "100%", md: "78%" },
          p: 1.5,
          borderRadius: 2,
          backgroundColor: esUsuario ? "primary.main" : "background.paper",
          color: esUsuario ? "primary.contrastText" : "text.primary",
          border: esUsuario ? "none" : "1px solid",
          borderColor: "divider",
          boxShadow: esUsuario ? "0 4px 12px rgba(25, 118, 210, 0.20)" : "none",
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 700 }}>
          {esUsuario ? "Tú" : "Asistente"}
        </Typography>

        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {mensaje.texto}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;

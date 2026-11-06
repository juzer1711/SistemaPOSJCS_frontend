import React from "react";
import { Box, Chip, Typography } from "@mui/material";

const preguntas = [
  "¿Cuánto vendimos hoy?",
  "¿Cuál es el producto más vendido?",
  "¿Qué productos tienen stock bajo?",
  "¿Quién tiene más ventas este mes?",
  "¿Cuántos clientes tenemos?",
];

const PreguntasFrecuentes = ({ onSeleccionarPregunta, disabled = false }) => {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} mb={1}>
        Preguntas frecuentes
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {preguntas.map((pregunta) => (
          <Chip
            key={pregunta}
            label={pregunta}
            variant="outlined"
            color="primary"
            clickable
            disabled={disabled}
            onClick={() => onSeleccionarPregunta(pregunta)}
            sx={{ fontWeight: 500 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PreguntasFrecuentes;

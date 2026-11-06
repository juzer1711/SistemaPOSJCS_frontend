import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

import ChatMessage from "./ChatMessage";
import PreguntasFrecuentes from "./PreguntasFrecuentes";
import { consultarAsistente } from "../../services/asistenteService";

const AsistentePanel = () => {
  const [pregunta, setPregunta] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ejecutarConsulta = async (textoPregunta) => {
    const texto = textoPregunta.trim();

    if (!texto || loading) {
      return;
    }

    setError("");
    setPregunta("");
    setLoading(true);

    setMensajes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        autor: "usuario",
        texto,
      },
    ]);

    try {
      const data = await consultarAsistente(texto);

      setMensajes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          autor: "asistente",
          texto: data.respuesta,
          tipoConsulta: data.tipoConsulta,
        },
      ]);
    } catch (err) {
      setError(err.message || "No fue posible consultar el asistente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    ejecutarConsulta(pregunta);
  };

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        border: "1px solid #eee",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          🤖 Asistente Inteligente
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            gap: 1.5,
            flexDirection: { xs: "column", sm: "row" },
            mb: 2,
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={pregunta}
            disabled={loading}
            placeholder="Escribe tu pregunta..."
            onChange={(event) => setPregunta(event.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !pregunta.trim()}
            sx={{ minWidth: 130, fontWeight: 700 }}
          >
            Consultar
          </Button>
        </Box>

        <PreguntasFrecuentes
          disabled={loading}
          onSeleccionarPregunta={ejecutarConsulta}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            mt: 2,
            p: 2,
            minHeight: 180,
            maxHeight: 360,
            overflowY: "auto",
            borderRadius: 2,
            backgroundColor: "#f7f9fc",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {mensajes.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Haz una consulta sobre ventas, inventario, cajas, cajeros, clientes o empresa.
            </Typography>
          )}

          {mensajes.map((mensaje) => (
            <ChatMessage key={mensaje.id} mensaje={mensaje} />
          ))}

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Consultando...
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AsistentePanel;

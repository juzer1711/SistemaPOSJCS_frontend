import React, { useMemo, useState } from "react";
import {
  Paper, TextField, Typography, Box,
  InputAdornment, Badge,
} from "@mui/material";
import SearchIcon     from "@mui/icons-material/Search";
import CategoryIcon   from "@mui/icons-material/Category";
import { posStyles as sx } from "../../styles/pos/stylesPOS";

// ── Nivel de stock ────────────────────────────────────────────────────
const getStockNivel = (p) => {
  const stock = p.stockActual ?? 0;
  const min   = p.stockMinimo ?? 0;
  if (stock <= 0)   return { nivel: "none", label: "Sin stock" };
  if (stock <= min) return { nivel: "low",  label: `Bajo: ${stock}` };
  return               { nivel: "ok",   label: `Stock: ${stock}` };
};

const ProductCard = ({ p, onAdd }) => {
  const { nivel, label } = getStockNivel(p);

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor:
          nivel === "none" ? "error.light"
          : nivel === "low" ? "warning.light"
          : "divider",
        backgroundColor:
          nivel === "none" ? "#fff5f5"
          : nivel === "low" ? "#fffbf0"
          : "background.paper",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor:
            nivel === "none" ? "error.main"
            : nivel === "low" ? "warning.main"
            : "primary.light",
          transform: "translateX(2px)",
        },
        p: 1.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
      onClick={() => onAdd(p)}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {p.nombre}
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            fontSize: "0.68rem",
            fontWeight: 600,
            px: 0.8,
            py: 0.2,
            borderRadius: 1,
            mt: 0.3,
            backgroundColor:
              nivel === "none" ? "#ffebee"
              : nivel === "low" ? "#fff3e0"
              : "#e8f5e9",
            color:
              nivel === "none" ? "#c62828"
              : nivel === "low" ? "#e65100"
              : "#2e7d32",
          }}
        >
          {label}
        </Box>
      </Box>

      <Typography
        variant="subtitle2"
        fontWeight={700}
        color="primary.main"
        sx={{ flexShrink: 0 }}
      >
        ${Number(p.precioventa).toLocaleString("es-CO")}
      </Typography>
    </Box>
  );
};

const ProductSidebar = ({ productos = [], onAdd = () => {} }) => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return productos;
    return productos.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(t) ||
        p.codigoBarras?.toString().includes(t)
    );
  }, [productos, q]);

  return (
    <Paper elevation={0} sx={sx.panel}>
      {/* Header */}
      <Box sx={sx.panelHeader}>
        <Typography variant="subtitle2" fontWeight={700}>
          Productos
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {productos.length} productos
        </Typography>
      </Box>

      {/* Buscador */}
      <Box sx={{ px: 1.5, py: 1, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar o escanear código..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Lista */}
      <Box sx={sx.scrollArea}>
        {productos.length === 0 ? (
          // Estado vacío — sin productos cargados
          <Box sx={{ textAlign: "center", mt: 6, color: "text.disabled" }}>
            <CategoryIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2">No hay productos disponibles</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          // Sin resultados de búsqueda
          <Box sx={{ textAlign: "center", mt: 6, color: "text.disabled" }}>
            <SearchIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2">Sin resultados para "{q}"</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
            {filtered.map((p) => (
              <ProductCard key={p.idProducto} p={p} onAdd={onAdd} />
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ProductSidebar;
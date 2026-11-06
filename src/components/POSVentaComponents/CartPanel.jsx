import React, { useMemo } from "react";
import { Paper, Typography, IconButton, Box, Divider, Badge } from "@mui/material";
import DeleteIcon  from "@mui/icons-material/Delete";
import AddIcon     from "@mui/icons-material/Add";
import RemoveIcon  from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTheme } from "@mui/material/styles";
import { posStyles as sx } from "../../styles/pos/stylesPOS";

const CartItem = ({ i, onChangeQty, onRemove }) => {
  const theme = useTheme();
  return (
    <Box sx={sx.cartItem}>
      {/* Nombre + eliminar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
        <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1, mr: 1 }}>
          {i.nombre}
        </Typography>
        <IconButton size="small" color="error" onClick={() => onRemove(i.idProducto)}
          sx={{ p: 0.3 }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Controles */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.secondary">
          ${Number(i.precioUnitario).toLocaleString("es-CO")} c/u
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <IconButton size="small" sx={sx.qtyBtn(theme)}
            onClick={() => onChangeQty(i.idProducto, Math.max(1, i.cantidad - 1))}>
            <RemoveIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <Typography variant="body2" fontWeight={700} sx={{ minWidth: 20, textAlign: "center" }}>
            {i.cantidad}
          </Typography>
          <IconButton size="small" sx={sx.qtyBtn(theme)}
            onClick={() => onChangeQty(i.idProducto, i.cantidad + 1)}>
            <AddIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>

        <Typography variant="body2" fontWeight={700} color="primary.main">
          ${(i.precioUnitario * i.cantidad).toLocaleString("es-CO")}
        </Typography>
      </Box>
    </Box>
  );
};

const CartPanel = ({ items = [], onChangeQty = () => {}, onRemove = () => {} }) => {
  const total = useMemo(
    () => items.reduce((acc, i) => acc + Number(i.precioUnitario) * Number(i.cantidad), 0),
    [items]
  );

  return (
    <Paper elevation={0} sx={sx.panel}>
      {/* Header con badge de cantidad */}
      <Box sx={sx.panelHeader}>
        <Typography variant="subtitle2" fontWeight={700}>
          Carrito
        </Typography>
        <Badge
          badgeContent={items.length}
          color="primary"
          showZero
        >
          <ShoppingCartIcon fontSize="small" color={items.length ? "primary" : "disabled"} />
        </Badge>
      </Box>

      {/* Items */}
      <Box sx={sx.scrollArea}>
        {items.length === 0 ? (
          // ✅ Estado vacío ilustrativo
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", color: "text.disabled", gap: 1 }}>
            <ShoppingCartIcon sx={{ fontSize: 56 }} />
            <Typography variant="body2" fontWeight={500}>
              El carrito está vacío
            </Typography>
            <Typography variant="caption" textAlign="center">
              Haz clic en un producto del panel izquierdo para agregarlo
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {items.map((i) => (
              <CartItem key={i.idProducto} i={i} onChangeQty={onChangeQty} onRemove={onRemove} />
            ))}
          </Box>
        )}
      </Box>

      {/* Footer total */}
      <Box sx={sx.cartFooter}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {items.length} {items.length === 1 ? "producto" : "productos"}
            </Typography>
            <Typography variant="h5" fontWeight={800} color="primary.main" lineHeight={1.1}>
              ${total.toLocaleString("es-CO")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CartPanel;
export const posStyles = {
  // ── Página principal ──────────────────────────────────────────────
  header: (theme) => ({
    height: 64,
    px: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    flexShrink: 0,
  }),

  clockBadge: (theme) => ({
    fontSize: "1.1rem",
    fontWeight: 700,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + "33",
    px: 1.5,
    py: 0.6,
    borderRadius: 2,
    letterSpacing: "0.04em",
    fontVariantNumeric: "tabular-nums",
  }),

  grid: {
    p: 1.5,
    height: "calc(100vh - 64px)",
    display: "grid",
    gridTemplateColumns: { md: "300px 1fr 340px" },
    gap: 1.5,
    backgroundColor: "grey.100",
    overflow: "hidden",
  },

  // ── Paneles compartidos ───────────────────────────────────────────
  panel: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 2.5,
    overflow: "hidden",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },

  panelHeader: {
    px: 2,
    py: 1.5,
    borderBottom: "1px solid",
    borderColor: "divider",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },

  scrollArea: {
    flex: 1,
    overflowY: "auto",
    p: 1.5,
  },

  // ── ProductSidebar ────────────────────────────────────────────────
prodCard: (nivel) => ({
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
  cursor: "pointer", // ✅ siempre
  transition: "all 0.15s ease",
  "&:hover": {
    transform: "translateX(2px)",
    borderColor:
      nivel === "none" ? "error.main"
      : nivel === "low" ? "warning.main"
      : "primary.light",
  },
  p: 1.2,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
}),

  stockBadge: (nivel) => {
    const map = {
      ok:   { bg: "#e8f5e9", color: "#2e7d32" },
      low:  { bg: "#fff3e0", color: "#e65100" },
      none: { bg: "#ffebee", color: "#c62828" },
    };
    const s = map[nivel] || map.ok;
    return {
      fontSize: "0.68rem",
      fontWeight: 600,
      px: 0.8,
      py: 0.2,
      borderRadius: 1,
      backgroundColor: s.bg,
      color: s.color,
    };
  },

  // ── CartPanel ─────────────────────────────────────────────────────
  cartItem: {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2,
    p: 1.5,
    backgroundColor: "background.default",
    transition: "box-shadow 0.15s",
    "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  },

  qtyBtn: (theme) => ({
    width: 26,
    height: 26,
    borderRadius: 1.5,
    backgroundColor: theme.palette.primary.light + "33",
    color: theme.palette.primary.main,
    "&:hover": { backgroundColor: theme.palette.primary.light + "66" },
  }),

  cartFooter: {
    px: 2,
    py: 1.5,
    borderTop: "1px solid",
    borderColor: "divider",
    backgroundColor: "primary.50",
    flexShrink: 0,
  },

  // ── CheckoutPanel ─────────────────────────────────────────────────
  checkoutSection: {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2.5,
    p: 1.5,
  },

  sectionLabel: {
    fontSize: "0.68rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "text.disabled",
    mb: 1,
  },

  metodoPagoBtn: (active, theme) => ({
    flex: 1,
    py: 1.2,
    borderRadius: 2,
    border: "2px solid",
    borderColor: active ? theme.palette.primary.main : "divider",
    backgroundColor: active ? theme.palette.primary.light + "22" : "background.paper",
    color: active ? theme.palette.primary.main : "text.secondary",
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    transition: "all 0.15s",
    "&:hover": { borderColor: "primary.light" },
  }),

  cambioBadge: (positivo) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 1.5,
    px: 1.5,
    py: 1,
    borderRadius: 2,
    backgroundColor: positivo ? "#e8f5e9" : "#fff8e1",
    border: "1px solid",
    borderColor: positivo ? "success.light" : "warning.light",
  }),

  cobrarBtn: {
    py: 1.6,
    fontSize: "1rem",
    fontWeight: 700,
    borderRadius: 2.5,
    letterSpacing: "0.02em",
  },
};
export const styles = {
  page: {
    p: { xs: 2, sm: 3, md: 4 },
    backgroundColor: "background.default",
    minHeight: "100vh",
  },

  banner: {
    mb: 2.5,
    p: 2,
    borderRadius: 2.5,
    backgroundColor: "#fff8e1",
    border: "1.5px solid #ffe082",
    borderLeft: "5px solid #f9a825",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 1.5,
  },

  card: {
    mb: 3,
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },

  cardHeader: {
    px: 2.5,
    py: 1.8,
    borderBottom: "1px solid",
    borderColor: "divider",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "background.default",
  },

  // ── Formulario movimiento ──────────────────────────────────────────
  tipoBtnBase: {
    borderRadius: 2,
    border: "2px solid",
    p: 1.2,
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
    flex: 1,
  },

  stockPreview: (tipo) => ({
    mt: 0.5,
    px: 1.5,
    py: 0.8,
    borderRadius: 1.5,
    backgroundColor: tipo === "ENTRADA" ? "#e8f5e9" : "#ffebee",
    border: "1px solid",
    borderColor: tipo === "ENTRADA" ? "success.light" : "error.light",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),

  registrarBtn: (tipo) => ({
    mt: 2,
    py: 1.3,
    fontWeight: 700,
    fontSize: "0.9rem",
    borderRadius: 2,
    backgroundColor: tipo === "ENTRADA" ? "success.main" : "error.main",
    "&:hover": {
      backgroundColor: tipo === "ENTRADA" ? "success.dark" : "error.dark",
    },
  }),

  // ── Detalle dialog ─────────────────────────────────────────────────
  detailItem: {
    backgroundColor: "background.default",
    borderRadius: 2,
    p: 1.5,
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 1.5,
    mt: 1,
  },
};
export const styles = {
  page: {
    p: { xs: 2, sm: 3, md: 4 },
    backgroundColor: "background.default",
    minHeight: "100vh",
  },

  card: {
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

  // ── CajaDetailDialog ─────────────────────────────────────────────
  statCard: (color) => ({
    p: 2,
    borderRadius: 2.5,
    border: "1px solid",
    borderColor: color ? `${color}.light` : "divider",
    backgroundColor: color ? `${color}.50` : "background.default",
    height: "100%",
  }),

  detailSection: {
    mb: 3,
  },

  sectionLabel: {
    fontSize: "0.68rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "text.disabled",
    mb: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  diffChip: (diff) => ({
    fontWeight: 700,
    backgroundColor: diff === 0 ? "#e8f5e9" : "#ffebee",
    color: diff === 0 ? "#2e7d32" : "#c62828",
    border: "1px solid",
    borderColor: diff === 0 ? "#a5d6a7" : "#ef9a9a",
  }),
};
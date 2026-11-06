export const styles = {
  page: {
    p: { xs: 2, sm: 3, md: 4 },
    backgroundColor: "background.default",
    minHeight: "100vh",
  },

  welcomeBar: (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 2,
    p: 3,
    mb: 3,
    borderRadius: 3,
    backgroundColor: "background.paper",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  }),

  cajaCard: (open) => ({
    display: "flex",
    alignItems: "center",
    gap: 2.5,
    p: 2.5,
    mb: 4,
    borderRadius: 3,
    border: "1.5px solid",
    borderColor: open ? "success.light" : "error.light",
    backgroundColor: open ? "#f1f8f1" : "#fff8f8",
    flexWrap: "wrap",
  }),

  cajaIconBox: (open) => ({
    width: 56,
    height: 56,
    borderRadius: 2.5,
    backgroundColor: open ? "success.light" : "error.light",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),

  cajaPill: (open) => ({
    backgroundColor: "background.paper",
    border: "0.5px solid",
    borderColor: open ? "success.light" : "error.light",
    borderRadius: 2,
    px: 1.5,
    py: 0.75,
  }),

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    backgroundColor: "success.main",
    display: "inline-block",
    mr: 0.8,
    animation: "pulse 2s infinite",
    "@keyframes pulse": {
      "0%": { opacity: 1 },
      "50%": { opacity: 0.4 },
      "100%": { opacity: 1 },
    },
  },

  sectionLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "text.disabled",
    mb: 1.5,
  },

  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    p: 2.5,
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 28px rgba(0,0,0,0.09)",
    },
    height: "100%",
  },

  actionIconBox: (bgColor) => ({
    width: 52,
    height: 52,
    borderRadius: 2.5,
    backgroundColor: bgColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),
};
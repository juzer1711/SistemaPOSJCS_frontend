import { Box, Card, Typography } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import PeopleIcon from "@mui/icons-material/People";
import TodayIcon from "@mui/icons-material/Today";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function AuditoriaCards({ stats }) {
  const cards = [
    {
      label: "Registros",
      value: stats.total,
      icon: <HistoryIcon />,
      color: "#1976d2",
    },
    {
      label: "Usuarios",
      value: stats.usuarios,
      icon: <PeopleIcon />,
      color: "#2e7d32",
    },
    {
      label: "Hoy",
      value: stats.hoy,
      icon: <TodayIcon />,
      color: "#ed6c02",
    },
    {
      label: "Módulos",
      value: stats.modulos,
      icon: <CategoryIcon />,
      color: "#9c27b0",
    },
    {
      label: "Acción top",
      value: stats.accionTop,
      icon: <TrendingUpIcon />,
      color: "#d32f2f",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 2,
        mb: 2,
      }}
    >
      {cards.map((c) => (
        <Card
          key={c.label}
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              backgroundColor: c.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {c.icon}
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              {c.label}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {c.value}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
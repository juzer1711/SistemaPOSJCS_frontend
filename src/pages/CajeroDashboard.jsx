import React, { useState, useEffect } from "react";
import {
  Box, Grid, Typography,
  Skeleton, Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import PointOfSaleIcon   from "@mui/icons-material/PointOfSale";
import PersonIcon        from "@mui/icons-material/Person";
import ArrowForwardIcon  from "@mui/icons-material/ArrowForward";
import WarningAmberIcon  from "@mui/icons-material/WarningAmber";

import { getCajasAbiertas } from "../services/cajaService";
import { styles } from "../styles/dashboard/stylesCajeroDashboard";

// ── Acciones disponibles para el cajero ──────────────────────────────
const ACTIONS = [
  {
    title: "Nueva Venta",
    description: "Registra una transacción directamente en el punto de venta.",
    icon: PointOfSaleIcon,
    iconBg: "#e8f5e9",
    iconColor: "#2e7d32",
    route: "/nueva-venta",
  },
  {
    title: "Clientes",
    description: "Consulta y gestiona los clientes registrados en el sistema.",
    icon: PersonIcon,
    iconBg: "#ede7f6",
    iconColor: "#6a1b9a",
    route: "/gestion-clientes",
  },
];

// ── Subcomponente: tarjeta de acción ─────────────────────────────────
const ActionCard = ({ item, onClick }) => {
  const IconComponent = item.icon;
  return (
    <Box sx={styles.actionCard} onClick={onClick}>
      <Box sx={styles.actionIconBox(item.iconBg)}>
        <IconComponent sx={{ fontSize: 26, color: item.iconColor }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          {item.description}
        </Typography>
      </Box>
      <ArrowForwardIcon sx={{ color: "text.disabled", flexShrink: 0 }} />
    </Box>
  );
};

// ── Subcomponente: tarjeta de estado de caja ─────────────────────────
const CajaStatus = ({ cajaActual, loading }) => {
  const theme = useTheme();

  // Skeleton mientras carga
  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  // Sin caja abierta
  if (!cajaActual) {
    return (
      <Box
        sx={{
          ...styles.cajaCard(false),
          border: "1.5px dashed",
          borderColor: "error.light",
        }}
      >
        <Box sx={styles.cajaIconBox(false)}>
          <WarningAmberIcon sx={{ fontSize: 28, color: "error.main" }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="error.main">
            Sin caja asignada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            No puedes registrar ventas hasta que el administrador abra tu caja.
          </Typography>
        </Box>
      </Box>
    );
  }

  // Caja activa — pills con info clave
  const pills = [
    { label: "Cajero", value: cajaActual.nombreCajero },
    { label: "Monto inicial", value: `$${Number(cajaActual.montoInicial ?? 0).toLocaleString("es-CO")}` },
    { label: "Estado", value: cajaActual.estadoCaja },
  ];

  return (
    <Box sx={styles.cajaCard(true)}>
      <Box sx={styles.cajaIconBox(true)}>
        <PointOfSaleIcon sx={{ fontSize: 28, color: "success.dark" }} />
      </Box>

      <Box sx={{ flex: 1 }}>
        {/* Título con dot pulsante */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Box sx={styles.statusDot} />
          <Typography variant="subtitle1" fontWeight={700} color="success.dark">
            Caja #{cajaActual.idCaja} — Activa
          </Typography>
        </Box>

        {/* Pills de info */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {pills.map(({ label, value }) => (
            <Box key={label} sx={styles.cajaPill(true)}>
              <Typography variant="caption" color="text.disabled" display="block">
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="success.dark">
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// ── Página principal ─────────────────────────────────────────────────
const CajeroDashboard = () => {
  const navigate  = useNavigate();
  const theme     = useTheme();

  const username  = localStorage.getItem("username") || "Cajero";
  const idUsuario = localStorage.getItem("id_usuario");

  const [cajaActual, setCajaActual] = useState(null);
  const [loadingCaja, setLoadingCaja] = useState(true); // ✅ estado de carga

  useEffect(() => {
    const cargarCaja = async () => {
      try {
        const res = await getCajasAbiertas();
        const cajas = res.data.content ?? res.data; 
        const cajaDelCajero = cajas.find(
          (caja) => Number(caja.idUsuario) === Number(idUsuario)
        );
        setCajaActual(cajaDelCajero || null);
      } catch {
        setCajaActual(null);
      } finally {
        setLoadingCaja(false);
      }
    };
    cargarCaja();
  }, [idUsuario]);

  // Saludo dinámico
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "¡Buenos días";
    if (h < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <Box sx={styles.page}>

      {/* ── Barra de bienvenida ── */}
      <Box sx={styles.welcomeBar(theme)}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {getGreeting()}, {username}! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textTransform: "capitalize" }}>
            {today}
          </Typography>
        </Box>
      </Box>

      {/* ── Estado de la caja ── */}
      <Typography sx={styles.sectionLabel}>Tu caja de hoy</Typography>
      <Divider sx={{ mb: 2 }} />
      <CajaStatus cajaActual={cajaActual} loading={loadingCaja} />

      {/* ── Acciones disponibles ── */}
      <Typography sx={styles.sectionLabel}>Acciones disponibles</Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {ACTIONS.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
            <ActionCard item={item} onClick={() => navigate(item.route)} />
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default CajeroDashboard;
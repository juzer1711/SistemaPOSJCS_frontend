import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Stack,
  Chip,
  LinearProgress,
  Avatar,
  Paper,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import {
  getReporteResumen,
  getVentasPorMetodoPago,
  getTopProductos,
  getVentasPorCajero,
  getStock,
} from "../services/reportesService";
import AsistentePanel from "../components/Asistente/AsistentePanel";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const money = (value) => `$${Number(value || 0).toLocaleString("es-CO")}`;
const number = (value) => Number(value || 0).toLocaleString("es-CO");

const panelSx = {
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  backgroundColor: "background.paper",
};

const Reportes = () => {
  const navigate = useNavigate();

  const [resumen, setResumen] = useState(null);
  const [metodos, setMetodos] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [cajeros, setCajeros] = useState([]);
  const [stock, setStock] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filtroStock, setFiltroStock] = useState("BAJO");

  const stockFiltrado = useMemo(
    () =>
      stock.filter((p) => {
        if (filtroStock === "CRITICO") return p.stockActual <= 0;
        if (filtroStock === "BAJO")
          return p.stockActual > 0 && p.stockActual <= p.stockMinimo;
        if (filtroStock === "NORMAL")
          return p.stockMinimo > 0 && p.stockActual > p.stockMinimo;
        return true;
      }),
    [stock, filtroStock]
  );

  const stockCounts = useMemo(
    () => ({
      CRITICO: stock.filter((p) => p.stockActual <= 0).length,
      BAJO: stock.filter((p) => p.stockActual > 0 && p.stockActual <= p.stockMinimo).length,
      NORMAL: stock.filter((p) => p.stockMinimo > 0 && p.stockActual > p.stockMinimo).length,
    }),
    [stock]
  );

  const maxProducto = useMemo(
    () => Math.max(...topProductos.map((p) => p.cantidad || 0), 0),
    [topProductos]
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [resResumen, resMetodos, resTop, resCajeros, resStock] =
        await Promise.all([
          getReporteResumen(),
          getVentasPorMetodoPago(),
          getTopProductos(),
          getVentasPorCajero(),
          getStock("TODOS"),
        ]);

      setResumen(resResumen.data);
      setMetodos(resMetodos.data);
      setTopProductos(resTop.data);
      setCajeros(resCajeros.data);
      setStock(resStock.data);
    } catch (error) {
      console.log("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const COLORS = {
    EFECTIVO: "#1f9d55",
    TRANSFERENCIA: "#2563eb",
  };

  const fecha = new Date();
  const fechafull = fecha.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const horafull = fecha.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const summaryCards = [
    {
      label: "Ventas hoy",
      value: number(resumen?.ventasHoy),
      icon: TodayIcon,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Ventas mes",
      value: number(resumen?.ventasMes),
      icon: CalendarMonthIcon,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      label: "Total facturado",
      value: money(resumen?.totalFacturado),
      icon: PaymentsIcon,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: "IVA recaudado",
      value: money(resumen?.ivaRecaudado),
      icon: ReceiptLongIcon,
      color: "#ea580c",
      bg: "#fff7ed",
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 420 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">Cargando reportes...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#f6f8fb",
        minHeight: "calc(100vh - 56px)",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          ...panelSx,
          p: { xs: 2, md: 3 },
          mb: 3,
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fbff 58%, #eef6f1 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 52,
                height: 52,
                color: "#0f172a",
                backgroundColor: "#dbeafe",
              }}
            >
              <AssessmentIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Reportes del sistema
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Análisis general del negocio
              </Typography>
            </Box>
          </Stack>

          <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={0.5}>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>
              {fechafull}
            </Typography>
            <Chip
              size="small"
              icon={<PointOfSaleIcon />}
              label={horafull}
              sx={{ fontWeight: 700, backgroundColor: "#eef2ff", color: "#3730a3" }}
            />
          </Stack>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2.5,
          mb: 3,
          width: "100%",
        }}
      >
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Box key={label} sx={{ minWidth: 0, width: "100%" }}>
            <Card
              sx={{
                ...panelSx,
                width: "100%",
                height: "100%",
                transition: "transform 160ms ease, box-shadow 160ms ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.10)",
                },
              }}
            >
              <CardContent sx={{ p: 2.25 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={700}>
                      {label}
                    </Typography>
                    <Typography variant="h5" fontWeight={850} sx={{ mt: 1, lineHeight: 1.15 }}>
                      {value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ backgroundColor: bg, color, width: 46, height: 46 }}>
                    <Icon />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2.5,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ minWidth: 0, width: "100%" }}>
          <Paper elevation={0} sx={{ ...panelSx, p: 2.5, width: "100%", height: "100%" }}>
            <SectionHeader
              icon={<Inventory2Icon />}
              title="Stock de productos"
              action={
                filtroStock === "CRITICO" ? (
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/inventario")}
                    sx={{ fontWeight: 800 }}
                  >
                    Inventario
                  </Button>
                ) : null
              }
            />

            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
              <StockFilterChip
                label="Crítico"
                count={stockCounts.CRITICO}
                active={filtroStock === "CRITICO"}
                color="error"
                icon={<WarningAmberIcon />}
                onClick={() => setFiltroStock("CRITICO")}
              />
              <StockFilterChip
                label="Bajo"
                count={stockCounts.BAJO}
                active={filtroStock === "BAJO"}
                color="warning"
                icon={<Inventory2Icon />}
                onClick={() => setFiltroStock("BAJO")}
              />
              <StockFilterChip
                label="Normal"
                count={stockCounts.NORMAL}
                active={filtroStock === "NORMAL"}
                color="success"
                icon={<CheckCircleIcon />}
                onClick={() => setFiltroStock("NORMAL")}
              />
            </Stack>

            {filtroStock === "CRITICO" && (
              <Box
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#fff7ed",
                  border: "1px solid #fed7aa",
                }}
              >
                <Typography variant="body2" color="#9a3412" fontWeight={700}>
                  Estos productos necesitan reposición inmediata
                </Typography>
              </Box>
            )}

            <Stack spacing={1.25}>
              {stockFiltrado.length === 0 ? (
                <EmptyState text="No hay productos en esta categoría." />
              ) : (
                stockFiltrado.map((p, i) => {
                  const percent = p.stockMinimo > 0 ? Math.min((p.stockActual / p.stockMinimo) * 100, 140) : 0;
                  const barColor =
                    p.stockActual <= 0 ? "error" : p.stockActual <= p.stockMinimo ? "warning" : "success";

                  return (
                    <Box
                      key={`${p.producto}-${i}`}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Typography fontWeight={750} noWrap>
                          {p.producto}
                        </Typography>
                        <Typography fontWeight={850} color="text.primary">
                          {p.stockActual} / {p.stockMinimo}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(percent, 100)}
                        color={barColor}
                        sx={{ mt: 1.25, height: 7, borderRadius: 999, backgroundColor: "#e5e7eb" }}
                      />
                    </Box>
                  );
                })
              )}
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ minWidth: 0, width: "100%" }}>
          <Paper elevation={0} sx={{ ...panelSx, p: 2.5, width: "100%", height: "100%" }}>
            <SectionHeader icon={<StorefrontIcon />} title="Top productos" />

            <Stack spacing={2}>
              {topProductos?.length > 0 ? (
                topProductos.map((p, i) => {
                  const percent = maxProducto ? (p.cantidad / maxProducto) * 100 : 0;
                  return (
                    <Box key={`${p.producto}-${i}`}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: 13,
                              fontWeight: 850,
                              backgroundColor: i === 0 ? "#f59e0b" : "#e0f2fe",
                              color: i === 0 ? "#fff" : "#075985",
                            }}
                          >
                            {i + 1}
                          </Avatar>
                          <Typography fontWeight={750} noWrap>
                            {p.producto}
                          </Typography>
                        </Stack>
                        <Typography fontWeight={850}>{number(p.cantidad)}</Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={percent}
                        sx={{
                          mt: 1,
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: "#e5e7eb",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            backgroundColor: i === 0 ? "#f59e0b" : "#2563eb",
                          },
                        }}
                      />
                    </Box>
                  );
                })
              ) : (
                <EmptyState text="No hay productos vendidos para mostrar." />
              )}
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ minWidth: 0, width: "100%" }}>
          <Paper elevation={0} sx={{ ...panelSx, p: 2.5, width: "100%", height: "100%" }}>
            <SectionHeader icon={<PaymentsIcon />} title="Métodos de pago" />

            <Box sx={{ height: 290 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metodos}
                    dataKey="total"
                    nameKey="metodoPago"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={4}
                  >
                    {metodos.map((entry) => (
                      <Cell
                        key={entry.metodoPago}
                        fill={COLORS[entry.metodoPago] || "#64748b"}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => money(value)} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Stack spacing={1}>
              {metodos.map((m) => (
                <Stack
                  key={m.metodoPago}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: COLORS[m.metodoPago] || "#64748b",
                      }}
                    />
                    <Typography variant="body2" fontWeight={700}>
                      {m.metodoPago}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={850}>
                    {money(m.total)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ minWidth: 0, width: "100%" }}>
          <Paper elevation={0} sx={{ ...panelSx, p: 2.5, width: "100%", height: "100%" }}>
            <SectionHeader icon={<PointOfSaleIcon />} title="Ventas por cajero" />

            <Stack spacing={1.25}>
              {cajeros.length > 0 ? (
                cajeros.map((c, i) => (
                  <Box
                    key={`${c.cajero}-${i}`}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: i === 0 ? "#f8fafc" : "#fff",
                      border: "1px solid",
                      borderColor: i === 0 ? "#cbd5e1" : "divider",
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: 14,
                            fontWeight: 900,
                            backgroundColor:
                              i === 0 ? "#f59e0b" : i === 1 ? "#64748b" : i === 2 ? "#b45309" : "#dbeafe",
                            color: i <= 2 ? "#fff" : "#1e3a8a",
                          }}
                        >
                          {i + 1}
                        </Avatar>
                        <Typography fontWeight={800} noWrap>
                          {c.cajero}
                        </Typography>
                      </Stack>
                      <Typography fontWeight={900} color="primary.main">
                        {money(c.ventas)}
                      </Typography>
                    </Stack>
                  </Box>
                ))
              ) : (
                <EmptyState text="No hay ventas por cajero para mostrar." />
              )}
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ gridColumn: "1 / -1", minWidth: 0, width: "100%" }}>
          <AsistentePanel />
        </Box>
      </Box>
    </Box>
  );
};

function SectionHeader({ icon, title, action }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: 2 }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Avatar sx={{ width: 34, height: 34, backgroundColor: "#f1f5f9", color: "#0f172a" }}>
          {icon}
        </Avatar>
        <Typography variant="subtitle1" fontWeight={850}>
          {title}
        </Typography>
      </Stack>
      {action}
    </Stack>
  );
}

function StockFilterChip({ label, count, active, color, icon, onClick }) {
  return (
    <Chip
      icon={icon}
      label={`${label} (${count})`}
      clickable
      color={active ? color : "default"}
      variant={active ? "filled" : "outlined"}
      onClick={onClick}
      sx={{ fontWeight: 800 }}
    />
  );
}

function EmptyState({ text }) {
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        borderRadius: 2,
        border: "1px dashed",
        borderColor: "divider",
        textAlign: "center",
        backgroundColor: "#f8fafc",
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={650}>
        {text}
      </Typography>
    </Box>
  );
}

export default Reportes;

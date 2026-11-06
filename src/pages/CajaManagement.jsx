import {
  Box, Typography, Card, TextField,
  Button, ToggleButton, ToggleButtonGroup, Chip,
} from "@mui/material";
import {
  PointOfSale as CajaIcon,
  History     as HistoryIcon,
  LockOpen    as LockOpenIcon,
} from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableViewIcon    from "@mui/icons-material/TableView";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { useCajaManagement }   from "../hooks/cajas/useCajaManagement";
import CajaDetailDialog        from "../components/Cajas/CajaDetailDialog";
import CajasAbiertasGrid       from "../components/Cajas/CajasAbiertasGrid";
import HistorialCajasGrid      from "../components/Cajas/HistorialCajasGrid";
import DialogAbrirCaja         from "../components/Cajas/DialogAbrirCaja";
import { styles }              from "../styles/cajas/stylesCaja";

export default function CajaManagement() {
  const {
    usuarios, cajasAbiertas, historial, cajaSeleccionada,
    pageAbiertas, setPageAbiertas,
    pageHistorial, setPageHistorial,
    totalRowsAbiertas, totalRowsHistorial,
    filtroAbiertas, setFiltroAbiertas,
    filtroHistorial, setFiltroHistorial,
    form, setForm, errores, setErrores, saving,
    setBusquedaUsuario, loadingUsuarios,
    loadingAbiertas, loadingCerradas,
    detailOpen, setDetailOpen,
    handleAbrirCaja, handleCerrarCaja, verDetalleCaja,
    exportAbiertas,
    loadingAbiertasExcel,
    loadingAbiertasCSV,
    exportHistorial,
    loadingHistorialExcel,
    loadingHistorialCSV,
  } = useCajaManagement();

  // ── Estado local de la página ────────────────────────────────────
  const [vistaActiva, setVistaActiva]       = useState("abiertas");
  const [openDialogAbrir, setOpenDialogAbrir] = useState(false);

  return (
    <Box sx={styles.page}>

      {/* ── Header con acción ── */}
      <Box sx={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", flexWrap: "wrap",
        gap: 2, mb: 3,
      }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Gestión de Cajas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administra las cajas activas e historial de turnos
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<LockOpenIcon />}
          onClick={() => setOpenDialogAbrir(true)}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Abrir Caja
        </Button>
      </Box>

      {/* ── Toggle de vista ── */}
      <Box sx={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", gap: 1, mb: 2,
      }}>
        <ToggleButtonGroup
          value={vistaActiva}
          exclusive
          onChange={(_, val) => { if (val) setVistaActiva(val); }}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              px: 2.5, fontWeight: 600,
              borderRadius: "8px !important",
            },
          }}
        >
          <ToggleButton value="abiertas">
            <CajaIcon sx={{ fontSize: 16, mr: 0.8 }} />
            Cajas abiertas
            {cajasAbiertas.length > 0 && (
              <Chip
                label={cajasAbiertas.length}
                color="success"
                size="small"
                sx={{ ml: 1, height: 18, fontSize: "0.65rem" }}
              />
            )}
          </ToggleButton>
          <ToggleButton value="historial">
            <HistoryIcon sx={{ fontSize: 16, mr: 0.8 }} />
            Historial
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ── Vista: Cajas abiertas ── */}
      {vistaActiva === "abiertas" && (
        <Card elevation={0} sx={styles.card}>
          <Box sx={styles.cardHeader}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CajaIcon fontSize="small" color="success" />
              <Typography variant="subtitle2" fontWeight={700}>
                Cajas abiertas ahora mismo
              </Typography>
            </Box>
          </Box>

          {/* ── NUEVO: botones exportar ── */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={loadingAbiertasExcel
                ? <CircularProgress size={14} color="inherit" />
                : <FileDownloadIcon />}
              onClick={() => exportAbiertas("excel")}
              disabled={loadingAbiertasExcel}
            >
              Excel
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={loadingAbiertasCSV
                ? <CircularProgress size={14} color="inherit" />
                : <TableViewIcon />}
              onClick={() => exportAbiertas("csv")}
              disabled={loadingAbiertasCSV}
            >
              CSV
            </Button>

            </Box>

          {/* Filtros */}
          <Box sx={{ px: 2.5, pt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
             <TextField
                label="ID Caja"
                size="small"
                type="number"
                value={filtroAbiertas.idCaja}
                onChange={(e) =>
                  setFiltroAbiertas({ ...filtroAbiertas, idCaja: e.target.value })
                }
              />
            <TextField
              label="Cajero"
              size="small"
              value={filtroAbiertas.cajero}
              onChange={(e) =>
                setFiltroAbiertas({ ...filtroAbiertas, cajero: e.target.value })
              }
            />
            <TextField
              type="date"
              size="small"
              label="Fecha"
              InputLabelProps={{ shrink: true }}
              value={filtroAbiertas.fecha}
              onChange={(e) =>
                setFiltroAbiertas({ ...filtroAbiertas, fecha: e.target.value })
              }
            />
          </Box>

          <CajasAbiertasGrid
            rows={cajasAbiertas}
            totalRows={totalRowsAbiertas}
            page={pageAbiertas}
            onPageChange={setPageAbiertas}
            onVerDetalle={verDetalleCaja}
            onForzarCierre={handleCerrarCaja}
            loading={loadingAbiertas}
          />
        </Card>
      )}

      {/* ── Vista: Historial ── */}
      {vistaActiva === "historial" && (
        <Card elevation={0} sx={styles.card}>
          <Box sx={styles.cardHeader}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HistoryIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" fontWeight={700}>
                Historial de cajas cerradas
              </Typography>
            </Box>
          </Box>

        {/* ── NUEVO: botones exportar ── */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={loadingHistorialExcel
              ? <CircularProgress size={14} color="inherit" />
              : <FileDownloadIcon />}
            onClick={() => exportHistorial("excel")}
            disabled={loadingHistorialExcel}
          >
            Excel
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={loadingHistorialCSV
              ? <CircularProgress size={14} color="inherit" />
              : <TableViewIcon />}
            onClick={() => exportHistorial("csv")}
            disabled={loadingHistorialCSV}
          >
            CSV
          </Button>
        </Box>

          {/* Filtros */}
          <Box sx={{ px: 2.5, pt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
             <TextField
                label="ID Caja"
                size="small"
                type="number"
                value={filtroHistorial.idCaja}
                onChange={(e) =>
                  setFiltroHistorial({ ...filtroHistorial, idCaja: e.target.value })
                }
              />
            <TextField
              label="Cajero"
              size="small"
              value={filtroHistorial.cajero}
              onChange={(e) =>
                setFiltroHistorial({ ...filtroHistorial, cajero: e.target.value })
              }
            />
            <TextField
              type="date"
              label="Desde"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filtroHistorial.fechaInicio}
              onChange={(e) =>
                setFiltroHistorial({ ...filtroHistorial, fechaInicio: e.target.value })
              }
            />
            <TextField
              type="date"
              label="Hasta"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filtroHistorial.fechaFin}
              onChange={(e) =>
                setFiltroHistorial({ ...filtroHistorial, fechaFin: e.target.value })
              }
            />
          </Box>

          <HistorialCajasGrid
            rows={historial}
            totalRows={totalRowsHistorial}
            page={pageHistorial}
            onPageChange={setPageHistorial}
            onVerDetalle={verDetalleCaja}
            loading={loadingCerradas}
          />
        </Card>
      )}

      {/* ── Dialogs ── */}
      <DialogAbrirCaja
        open={openDialogAbrir}
        onClose={() => setOpenDialogAbrir(false)}
        usuarios={usuarios}
        form={form}
        setForm={setForm}
        errores={errores}
        setErrores={setErrores}
        saving={saving}
        loadingUsuarios={loadingUsuarios}
        setBusquedaUsuario={setBusquedaUsuario}
        handleAbrirCaja={async () => {
          await handleAbrirCaja();
          // Solo cierra si no hay errores — el hook los pone en errores.general
          if (!errores.general && !errores.usuario && !errores.montoInicial) {
            setOpenDialogAbrir(false);
          }
        }}
      />

      <CajaDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        caja={cajaSeleccionada}
      />
    </Box>
  );
}
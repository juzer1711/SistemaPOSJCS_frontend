import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "../modules/landing/pages/LandingPage.jsx";
import RegistroEmpresaPage from "../modules/empresa/pages/RegistroEmpresaPage.jsx";
import EmpresaProfile from "../pages/EmpresaProfile";
import Login from "../modules/auth/pages/LoginPage.jsx";
import AdminDashboard from "../modules/dashboard/pages/AdminDashboardPage.jsx";
import ReglasPage from "../modules/reglas/pages/ReglasPage.jsx";
import ModulosPage from "../modules/modulos/pages/ModulosPage.jsx";
import CajeroDashboard from "../pages/CajeroDashboard";
import UsuariosPage from "../modules/usuarios/pages/UsuariosPage.jsx";
import ProductManagement from "../pages/ProductManagement";
import ClientManagement from "../pages/ClientManagement";
import VentaManagement from "../pages/VentaManagement";
import AuditoriaManagement from "../pages/AuditoriaManagement";
import VentaPOS from "../pages/POSVenta";
import CajaManagement from "../pages/CajaManagement";
import InventarioManagement from "../pages/InventarioManagement";
import Reportes from "../pages/Reportes";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro-empresa" element={<RegistroEmpresaPage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

        <Route path="/cajero-dashboard" element={<PrivateRoute><CajeroDashboard /></PrivateRoute>} />

        <Route path="/gestion-usuarios" element={<PrivateRoute modulo="USUARIOS"><UsuariosPage /></PrivateRoute>} />

        <Route path="/gestion-reglas" element={<PrivateRoute modulo="REGLAS"><ReglasPage /></PrivateRoute>} />

        <Route path="/gestion-modulos" element={<PrivateRoute modulo="MODULOS"><ModulosPage /></PrivateRoute>} />

        <Route path="/gestion-productos" element={<PrivateRoute><ProductManagement /></PrivateRoute>} />

        <Route path="/gestion-clientes" element={<PrivateRoute><ClientManagement /></PrivateRoute>} />

        <Route path="/mostrar-ventas" element={<PrivateRoute><VentaManagement /></PrivateRoute>} />

        <Route path="/nueva-venta" element={<PrivateRoute><VentaPOS /></PrivateRoute>} />

        <Route path="/gestion-cajas" element={<PrivateRoute><CajaManagement /></PrivateRoute>} />

        <Route path="/inventario" element={<PrivateRoute><InventarioManagement /></PrivateRoute>} />

        <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />

        <Route path="/auditoria" element={<PrivateRoute><AuditoriaManagement /></PrivateRoute>} />

        <Route path="/empresa" element={<PrivateRoute><EmpresaProfile /></PrivateRoute>} />

      </Routes>
    </Router>
  );
}

export default AppRoutes;
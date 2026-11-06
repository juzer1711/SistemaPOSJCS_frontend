import {
  ChevronLeftRounded,
  ChevronRightRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  LogoutRounded,
  MenuRounded,
  StorefrontOutlined,
} from "@mui/icons-material";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useEmpresa } from "../../../context/EmpresaContext.jsx";
import { useSnackbar } from "../../../context/SnackBarProvider.jsx";
import logo from "../../../assets/logo.png";
import PermissionLink from "../../../components/ui/PermissionLink.jsx";
import { NAV_SECTIONS } from "../navigationConfig.js";
import styles from "./AppLayout.module.css";

const getInitials = (username = "") =>
  username.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { empresa } = useEmpresa();
  const { showSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();
  const username = user?.username || "Usuario";
  const initials = useMemo(() => getInitials(username), [username]);
  const [isDesktop, setIsDesktop] = useState(
    () => globalThis.matchMedia?.("(min-width: 821px)").matches ?? true
  );
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const activeSection = NAV_SECTIONS.find((section) =>
      section.items.some((item) => item.path === location.pathname)
    );
    if (activeSection) {
      setExpandedSections((current) => ({ ...current, [activeSection.label]: true }));
    }
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.("(min-width: 821px)");
    if (!mediaQuery) return undefined;

    const handleViewportChange = (event) => {
      setIsDesktop(event.matches);
      setMobileSidebarOpen(false);
      setSidebarExpanded(true);
    };

    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    if (!mobileSidebarOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileSidebarOpen(false);
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [mobileSidebarOpen]);

  const toggleSidebar = () => {
    if (isDesktop) {
      setSidebarExpanded((expanded) => !expanded);
    } else {
      setMobileSidebarOpen((open) => !open);
    }
  };

  const toggleSection = (label) => {
    setExpandedSections((current) => ({ ...current, [label]: !current[label] }));
  };

  const handleLogout = async () => {
    setProfileAnchor(null);
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      showSnackbar(
        "La sesión se cerró en este navegador, pero el servidor no confirmó la revocación del token.",
        "warning"
      );
    } finally {
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <div className={styles.topbarBrand}>
          <IconButton
            className={styles.menuToggle}
            onClick={toggleSidebar}
            aria-label={
              isDesktop
                ? sidebarExpanded ? "Contraer navegación" : "Expandir navegación"
                : mobileSidebarOpen ? "Cerrar navegación" : "Abrir navegación"
            }
            aria-expanded={isDesktop ? sidebarExpanded : mobileSidebarOpen}
            aria-controls="app-sidebar"
          >
            <MenuRounded />
          </IconButton>
          <NavLink className={styles.brandLink} to="/admin-dashboard" aria-label="Ir al panel principal">
            <img className={styles.logo} src={logo} alt="" />
            <span className={styles.brandText}>POS <strong>JCS</strong></span>
          </NavLink>
        </div>

        <div className={styles.topbarActions}>
          <span className={styles.companyName} title={empresa?.nombreComercial || "Sistema POS"}>
            {empresa?.nombreComercial || "Sistema POS"}
          </span>
          <button
            className={styles.profileButton}
            type="button"
            onClick={(event) => setProfileAnchor(event.currentTarget)}
            aria-haspopup="menu"
            aria-expanded={Boolean(profileAnchor)}
            aria-label={`Perfil de ${username}`}
          >
            <Avatar className={styles.avatar}>{initials}</Avatar>
            <span className={styles.profileName}>{username}</span>
            <ExpandMoreRounded aria-hidden="true" />
          </button>
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{ paper: { className: styles.profileMenu } }}
          >
            <div className={styles.profileMenuHeading}>
              <Avatar className={styles.avatar}>{initials}</Avatar>
              <div>
                <strong>{username}</strong>
                <span>Sesión activa</span>
              </div>
            </div>
            <MenuItem onClick={handleLogout} disabled={loggingOut} className={styles.logoutItem}>
              <LogoutRounded fontSize="small" />
              {loggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
            </MenuItem>
          </Menu>
        </div>
      </header>

      <div className={styles.workspace}>
        {mobileSidebarOpen && (
          <button
            className={styles.backdrop}
            type="button"
            aria-label="Cerrar navegación"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={`${styles.sidebar} ${sidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed} ${mobileSidebarOpen ? styles.mobileSidebarOpen : ""}`}
          id="app-sidebar"
          aria-label="Navegación principal"
          aria-hidden={!isDesktop && !mobileSidebarOpen}
          inert={!isDesktop && !mobileSidebarOpen}
        >
          <div className={styles.sidebarHeading}>
            {sidebarExpanded && <span>MENÚ PRINCIPAL</span>}
            <IconButton
              className={styles.sidebarToggle}
              onClick={() => setSidebarExpanded((expanded) => !expanded)}
              aria-label={sidebarExpanded ? "Contraer menú lateral" : "Expandir menú lateral"}
              title={sidebarExpanded ? "Contraer menú" : "Expandir menú"}
            >
              {sidebarExpanded ? <ChevronLeftRounded /> : <ChevronRightRounded />}
            </IconButton>
          </div>

          <nav className={styles.navigation}>
            {NAV_SECTIONS.map(({ label, icon: SectionIcon, items }) => {
              const isExpanded = Boolean(expandedSections[label]);
              const hasActiveItem = items.some((item) => item.path === location.pathname);
              return (
                <section className={styles.navSection} key={label}>
                  {sidebarExpanded ? (
                    <button
                      className={`${styles.sectionToggle} ${hasActiveItem ? styles.sectionActive : ""}`}
                      type="button"
                      onClick={() => toggleSection(label)}
                      aria-expanded={isExpanded}
                    >
                      <SectionIcon aria-hidden="true" />
                      <span>{label}</span>
                      {isExpanded
                        ? <ExpandLessRounded aria-hidden="true" />
                        : <ExpandMoreRounded aria-hidden="true" />}
                    </button>
                  ) : (
                    <span className={styles.collapsedSection} title={label}>
                      <SectionIcon aria-hidden="true" />
                    </span>
                  )}

                  {(isExpanded || !sidebarExpanded) && (
                    <div className={styles.navItems}>
                      {items.map(({ label: itemLabel, path, modulo, icon: ItemIcon }) => (
                        <PermissionLink
                          modulo={modulo}
                          className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                          }
                          to={path}
                          key={path}
                          title={sidebarExpanded ? undefined : itemLabel}
                          aria-label={!sidebarExpanded ? itemLabel : undefined}
                          onClick={() => setMobileSidebarOpen(false)}
                        >
                          <ItemIcon aria-hidden="true" />
                          {sidebarExpanded && <span>{itemLabel}</span>}
                        </PermissionLink>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <StorefrontOutlined aria-hidden="true" />
            {sidebarExpanded && <span>POS JCS</span>}
          </div>
        </aside>

        <main className={styles.mainContent} id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

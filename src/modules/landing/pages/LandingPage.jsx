import {
  AccountBalanceWalletRounded,
  AssessmentRounded,
  BusinessRounded,
  CategoryRounded,
  Inventory2Rounded,
  PeopleAltRounded,
  PointOfSaleRounded,
  ReceiptLongRounded,
  RuleRounded,
  SettingsRounded,
  StorefrontRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEmpresa } from "../../../context/EmpresaContext";
import styles from "./LandingPage.module.css";

const features = [
  {
    icon: PointOfSaleRounded,
    title: "Ventas y punto de venta",
    description: "Registra ventas y consulta su detalle desde un flujo ágil.",
  },
  {
    icon: ReceiptLongRounded,
    title: "Tiquetes de venta",
    description: "Genera comprobantes con la información de cada venta.",
  },
  {
    icon: Inventory2Rounded,
    title: "Productos e inventario",
    description: "Organiza el catálogo y lleva control de existencias.",
  },
  {
    icon: CategoryRounded,
    title: "Catálogo y categorías",
    description: "Mantén productos y categorías ordenados para la operación.",
  },
  {
    icon: AccountBalanceWalletRounded,
    title: "Control de caja",
    description: "Gestiona cajas, movimientos y cierres de operación.",
  },
  {
    icon: PeopleAltRounded,
    title: "Clientes y usuarios",
    description: "Administra la información de clientes y las cuentas del equipo.",
  },
  {
    icon: AssessmentRounded,
    title: "Reportes y auditoría",
    description: "Consulta resultados y conserva trazabilidad de las acciones.",
  },
  {
    icon: RuleRounded,
    title: "Permisos por usuario",
    description: "Configura el acceso a funciones según las reglas asignadas.",
  },
  {
    icon: SettingsRounded,
    title: "Módulos configurables",
    description: "Organiza las áreas funcionales que componen el sistema.",
  },
  {
    icon: BusinessRounded,
    title: "Perfil de empresa",
    description: "Actualiza los datos del negocio y su imagen para los tiquetes.",
  },
  {
    icon: SupportAgentRounded,
    title: "Asistente de apoyo",
    description: "Encuentra orientación para consultar información del negocio.",
  },
];

export default function LandingPage() {
  const { empresa, empresaLoading, empresaError, cargarEmpresa } = useEmpresa();
  const hasCompany = Boolean(empresa);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} to="/" aria-label="POS JCS, inicio">
          <span className={styles.brandMark} aria-hidden="true">
            <StorefrontRounded />
          </span>
          <span className={styles.brandName}>POS <strong>JCS</strong></span>
        </Link>
        <a className={styles.headerLink} href="#funciones">Conoce las funciones</a>
      </header>

      <section className={styles.hero} aria-labelledby="landing-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Gestión para tu negocio</span>
          <h1 id="landing-title">
            Tu operación diaria,
            <span> en un solo lugar.</span>
          </h1>
          <p className={styles.heroDescription}>
            Una plataforma para administrar ventas, inventario, caja y la
            información que necesitas para tomar mejores decisiones.
          </p>
          <a className={styles.secondaryLink} href="#funciones">
            Explorar funcionalidades <span aria-hidden="true">↓</span>
          </a>
        </div>

        <section className={styles.accessCard} aria-labelledby="access-title">
          <span className={styles.accessIcon} aria-hidden="true">
            <StorefrontRounded />
          </span>
          <p className={styles.cardEyebrow}>Acceso al sistema</p>
          <h2 id="access-title">
            {empresaLoading
              ? "Estamos verificando tu instalación"
              : hasCompany
                ? "Tu empresa está registrada"
                : empresaError
                  ? "No pudimos verificar la empresa"
                  : "Configura tu empresa"}
          </h2>

          {empresaLoading ? (
            <p className={styles.statusMessage} role="status" aria-live="polite">
              Consultando el estado de la instalación…
            </p>
          ) : empresaError ? (
            <>
              <p className={styles.statusMessage} role="alert">
                {empresaError.message || "No fue posible conectar con el servidor."}
              </p>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={cargarEmpresa}
              >
                Reintentar consulta
              </button>
            </>
          ) : (
            <>
              <p className={styles.statusMessage}>
                {hasCompany
                  ? `Instalación lista${empresa.nombreComercial ? ` para ${empresa.nombreComercial}` : ""}.`
                  : "Completa la configuración inicial para comenzar a usar el sistema."}
              </p>
              <Link
                className={styles.primaryButton}
                to={hasCompany ? "/login" : "/registro-empresa"}
              >
                {hasCompany ? "Iniciar sesión" : "Configurar empresa"}
                <span aria-hidden="true">→</span>
              </Link>
            </>
          )}
          <p className={styles.cardFootnote}>
            {hasCompany
              ? "Accede con las credenciales de un usuario registrado."
              : "La configuración inicial se realiza una sola vez por instalación."}
          </p>
        </section>
      </section>

      <section className={styles.features} id="funciones" aria-labelledby="features-title">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Un sistema conectado</span>
          <h2 id="features-title">Todo lo esencial para gestionar tu negocio</h2>
          <p>Herramientas para el trabajo diario y el control de tu operación.</p>
        </div>

        <div className={styles.featureGrid}>
          {features.map(({ icon: Icon, title, description }) => (
            <article className={styles.featureCard} key={title}>
              <span className={styles.featureIcon} aria-hidden="true">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>POS JCS</span>
        <span>Administración clara para el día a día de tu negocio.</span>
      </footer>
    </main>
  );
}

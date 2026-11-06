import { ArrowForwardRounded, AutoAwesomeRounded, CalendarMonthRounded } from "@mui/icons-material";
import PermissionLink from "../../../components/ui/PermissionLink.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useEmpresa } from "../../../context/EmpresaContext.jsx";
import { NAV_SECTIONS } from "../../layout/navigationConfig.js";
import styles from "./AdminDashboardPage.module.css";

const dashboardSections = NAV_SECTIONS.filter((section) => section.label !== "Inicio");

const getGreeting = (date) => {
  const hour = date.getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

const getToday = (date) =>
  new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

const getLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { empresa } = useEmpresa();
  const now = new Date();
  const username = user?.username || "Usuario";

  return (
    <div className={styles.page}>
      <section className={styles.welcome} aria-labelledby="welcome-title">
        <div className={styles.welcomeCopy}>
          <span className={styles.welcomeEyebrow}>
            <AutoAwesomeRounded aria-hidden="true" />
            Panel principal
          </span>
          <h1 id="welcome-title">
            {getGreeting(now)}, <span>{username}</span>
          </h1>
          <p>
            {empresa?.nombreComercial
              ? `Aquí tienes a mano las herramientas de ${empresa.nombreComercial}.`
              : "Aquí tienes a mano las herramientas para gestionar tu negocio."}
          </p>
          <div className={styles.date}>
            <CalendarMonthRounded aria-hidden="true" />
            <time dateTime={getLocalDate(now)}>{getToday(now)}</time>
          </div>
        </div>
        <div className={styles.welcomeArt} aria-hidden="true">
          <span className={styles.artCircle} />
          <span className={styles.artCircleSmall} />
          <AutoAwesomeRounded className={styles.artIcon} />
        </div>
      </section>

      <section className={styles.modules} aria-labelledby="modules-title">
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Tu espacio de trabajo</p>
            <h2 id="modules-title">¿Qué necesitas hacer?</h2>
          </div>
          <p>Accede directamente a cada área del sistema.</p>
        </header>

        <div className={styles.sections}>
          {dashboardSections.map(({ label, icon: SectionIcon, items }) => (
            <section className={styles.moduleSection} key={label} aria-labelledby={`section-${label}`}>
              <header className={styles.moduleSectionHeader}>
                <span className={styles.sectionIcon} aria-hidden="true">
                  <SectionIcon />
                </span>
                <h3 id={`section-${label}`}>{label}</h3>
                <span className={styles.sectionCount}>
                  {items.length} {items.length === 1 ? "opción" : "opciones"}
                </span>
              </header>

              <div className={styles.cardGrid}>
                {items.map(({ label: itemLabel, description, path, modulo, icon: ItemIcon, tone }) => (
                  <PermissionLink modulo={modulo} className={styles.moduleCard} data-tone={tone} key={path} to={path}>
                    <span className={styles.cardIcon} aria-hidden="true">
                      <ItemIcon />
                    </span>
                    <span className={styles.cardCopy}>
                      <strong>{itemLabel}</strong>
                      <span>{description}</span>
                    </span>
                    <ArrowForwardRounded className={styles.cardArrow} aria-hidden="true" />
                  </PermissionLink>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

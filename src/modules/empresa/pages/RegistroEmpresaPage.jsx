import { ArrowBackRounded, BusinessRounded, LockRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEmpresa } from "../../../context/EmpresaContext";
import { useRegistroEmpresa } from "../hooks/useRegistroEmpresa.js";
import styles from "./RegistroEmpresaPage.module.css";
import { empresaFields } from "../validation/empresaFields.js";

const fields = empresaFields.map(({ fullWidth, optional, ...field }) => field);

function RegistrationStatus({ message, onRetry, actionHref, actionLabel }) {
  return (
    <main className={styles.page}>
      <section className={styles.statusCard}>
        <h1>Configuración inicial</h1>
        <p role="status">{message}</p>
        {onRetry && (
          <button className={styles.submitButton} type="button" onClick={onRetry}>
            Reintentar
          </button>
        )}
        {actionHref && (
          <Link className={styles.submitButton} to={actionHref}>
            {actionLabel}
          </Link>
        )}
        <Link className={styles.backLink} to="/">Volver al inicio</Link>
      </section>
    </main>
  );
}

export default function RegistroEmpresaPage() {
  const {
    empresa: empresaRegistrada,
    empresaLoading,
    empresaError,
    cargarEmpresa,
  } = useEmpresa();
  const {
    empresa,
    setupToken,
    loading,
    mensaje,
    fieldErrors,
    handleChange,
    handleSubmit,
  } = useRegistroEmpresa();

  if (empresaLoading) {
    return <RegistrationStatus message="Verificando el estado de esta instalación…" />;
  }

  if (empresaError) {
    return (
      <RegistrationStatus
        message={empresaError.message || "No fue posible verificar la empresa."}
        onRetry={cargarEmpresa}
      />
    );
  }

  if (empresaRegistrada) {
    return (
      <RegistrationStatus
        message="Ya existe una empresa registrada en esta instalación."
        actionHref="/login"
        actionLabel="Iniciar sesión"
      />
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.backLink} to="/">
          <ArrowBackRounded aria-hidden="true" />
          Volver al inicio
        </Link>
        <span className={styles.brand}>POS <strong>JCS</strong></span>
      </header>

      <section className={styles.content} aria-labelledby="registration-title">
        <div className={styles.intro}>
          <span className={styles.introIcon} aria-hidden="true">
            <BusinessRounded />
          </span>
          <p className={styles.eyebrow}>Primer paso</p>
          <h1 id="registration-title">Registra tu empresa</h1>
          <p>
            Ingresa los datos que identifican tu negocio. Podrás actualizar el
            perfil y agregar el logo después de iniciar sesión.
          </p>
        </div>

        <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
          <div className={styles.formGrid}>
            {fields.map(({ name, label, ...inputProps }) => (
              <div className={styles.field} key={name}>
                <label htmlFor={name}>
                  {label}
                  {name !== "correo" && <span aria-hidden="true"> *</span>}
                </label>
                <input
                  {...inputProps}
                  id={name}
                  name={name}
                  value={empresa[name]}
                  onChange={handleChange}
                  required={name !== "correo"}
                  aria-invalid={Boolean(fieldErrors[name])}
                  aria-describedby={fieldErrors[name] ? `${name}-error` : undefined}
                />
                {fieldErrors[name] && (
                  <span className={styles.fieldError} id={`${name}-error`}>
                    {fieldErrors[name]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className={styles.securitySection}>
            <div className={styles.securityHeading}>
              <LockRounded aria-hidden="true" />
              <div>
                <h2>Clave de configuración inicial</h2>
                <p>Solicítala al administrador de esta instalación.</p>
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="setupToken">Token de configuración <span aria-hidden="true">*</span></label>
              <input
                id="setupToken"
                name="setupToken"
                type="password"
                autoComplete="new-password"
                value={setupToken}
                onChange={handleChange}
                required
                aria-invalid={Boolean(fieldErrors.setupToken)}
                aria-describedby={fieldErrors.setupToken ? "setupToken-error" : "setup-token-help"}
              />
              <span className={styles.fieldHint} id="setup-token-help">
                Se envía únicamente al servidor para autorizar este registro y no se guarda en el navegador.
              </span>
              {fieldErrors.setupToken && (
                <span className={styles.fieldError} id="setupToken-error">
                  {fieldErrors.setupToken}
                </span>
              )}
            </div>
          </div>

          {mensaje && (
            <p className={styles.formError} role="alert">
              {mensaje}
            </p>
          )}

          <button className={styles.submitButton} type="submit" disabled={loading}>
            {loading ? "Registrando…" : "Registrar empresa"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
          <p className={styles.requiredNote}>* Campos obligatorios</p>
        </form>
      </section>
    </main>
  );
}

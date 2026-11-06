// src/modules/login/Login.jsx
import { ArrowBackRounded, LockOutlined, PersonOutlineRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useLogin } from "../hooks/useLogin.js";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const {
    username,
    password,
    mensaje,
    fieldErrors,
    loading,
    handleUsernameChange,
    handlePasswordChange,
    handleSubmit,
  } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className={styles.page}>
      <aside className={styles.brandPanel} aria-label="Acerca de POS JCS">
        <Link className={styles.brand} to="/" aria-label="Volver al inicio">
          <img className={styles.logo} src={logo} alt="" />
          <span>POS <strong>JCS</strong></span>
        </Link>
        <div className={styles.brandCopy}>
          <p className={styles.eyebrow}>Control sencillo, negocio en marcha</p>
          <h1>Tu negocio, bajo control.</h1>
          <p>
            Administra ventas, inventario y caja desde una plataforma pensada
            para acompañar tu operación diaria.
          </p>
        </div>
        <p className={styles.brandFooter}>Una herramienta para trabajar con claridad.</p>
      </aside>

      <section className={styles.formPanel} aria-labelledby="login-title">
        <Link className={styles.mobileBrand} to="/">
          <img src={logo} alt="" />
          <span>POS <strong>JCS</strong></span>
        </Link>

        <div className={styles.loginCard}>
          <Link className={styles.backLink} to="/">
            <ArrowBackRounded aria-hidden="true" />
            Volver al inicio
          </Link>

          <div className={styles.formHeading}>
            <span className={styles.lockIcon} aria-hidden="true">
              <LockOutlined />
            </span>
            <p className={styles.eyebrow}>Acceso seguro</p>
            <h2 id="login-title">Iniciar sesión</h2>
            <p>Ingresa tus credenciales para continuar.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="username">Usuario</label>
              <div className={`${styles.inputWrap} ${fieldErrors.username ? styles.inputError : ""}`}>
                <PersonOutlineRounded aria-hidden="true" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                  disabled={loading}
                  required
                  aria-invalid={Boolean(fieldErrors.username)}
                  aria-describedby={fieldErrors.username ? "username-error" : undefined}
                />
              </div>
              {fieldErrors.username && (
                <span className={styles.fieldError} id="username-error">
                  {fieldErrors.username}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Contraseña</label>
              <div className={`${styles.inputWrap} ${fieldErrors.password ? styles.inputError : ""}`}>
                <LockOutlined aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                />
                <IconButton
                  className={styles.visibilityButton}
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={loading}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={showPassword}
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
              {fieldErrors.password && (
                <span className={styles.fieldError} id="password-error">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {mensaje && (
              <p className={styles.serverError} role="alert" aria-live="assertive">
                {mensaje}
              </p>
            )}

            <button className={styles.submitButton} type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  <span>Verificando credenciales…</span>
                </>
              ) : (
                "Entrar al sistema"
              )}
            </button>
          </form>
        </div>

        <footer className={styles.footer}>
          © 2026 POS JCS
        </footer>
      </section>
    </main>
  );
}
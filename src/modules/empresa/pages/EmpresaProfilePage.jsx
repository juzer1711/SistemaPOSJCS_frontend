import { Alert, Button, CircularProgress } from "@mui/material";
import CrudPageHeader from "../../../components/ui/crud/CrudPageHeader.jsx";
import EmpresaLogoSection from "../components/EmpresaLogoSection.jsx";
import EmpresaProfileForm from "../components/EmpresaProfileForm.jsx";
import useEmpresaProfile from "../hooks/useEmpresaProfile.js";
import styles from "./EmpresaProfilePage.module.css";

export default function EmpresaProfilePage() {
  const profile = useEmpresaProfile();
  return (
    <div className={styles.page}>
      <CrudPageHeader title="Perfil de empresa" subtitle="Consulta los datos de tu negocio y administra su información e imagen." />
      {profile.loading ? (
        <div className={styles.loading} role="status">
          <CircularProgress size={28} aria-label="Cargando empresa" />
          <span>Cargando información de la empresa…</span>
        </div>
      ) : profile.error ? (
        <Alert severity="error" action={<Button onClick={() => profile.retry()}>Reintentar</Button>}>
          {profile.error.message || "No fue posible cargar la empresa."}
        </Alert>
      ) : !profile.empresa ? (
        <Alert severity="info" action={<Button onClick={() => profile.retry()}>Volver a consultar</Button>}>
          No existe una empresa registrada. La configuración inicial corresponde a la instalación del sistema.
        </Alert>
      ) : <>
        {profile.notice && <Alert severity={profile.notice.severity} className={styles.notice}
          role={profile.notice.severity === "error" ? "alert" : "status"}>
          {profile.notice.message}
        </Alert>}
        <div className={styles.card}>
          <EmpresaLogoSection empresa={profile.empresa} canUpdate={profile.canUpdate}
            busy={profile.busy} uploading={profile.uploadingLogo} error={profile.logoError} onChange={profile.handleLogoChange} />
          <EmpresaProfileForm values={profile.values} fieldErrors={profile.fieldErrors} focusError={profile.focusError}
            canUpdate={profile.canUpdate} busy={profile.busy} saving={profile.saving} dirty={profile.dirty}
            onChange={profile.handleChange} onSubmit={profile.handleSave} onReset={profile.resetForm} />
        </div>
      </>}
    </div>
  );
}

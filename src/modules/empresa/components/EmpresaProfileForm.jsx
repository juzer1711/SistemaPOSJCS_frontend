import { useEffect, useRef } from "react";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { SaveOutlined } from "@mui/icons-material";
import { empresaFields } from "../validation/empresaFields.js";
import styles from "../pages/EmpresaProfilePage.module.css";

export default function EmpresaProfileForm({
  values, fieldErrors, focusError, canUpdate, busy, saving, dirty, onChange, onSubmit, onReset,
}) {
  const formRef = useRef(null);

  useEffect(() => {
    if (focusError) formRef.current?.elements.namedItem(focusError.name)?.focus();
  }, [focusError]);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby="empresa-data-title" aria-busy={saving}>
      <Typography component="h2" variant="h6" id="empresa-data-title">Información de la empresa</Typography>
      <p className={styles.description}>
        {canUpdate ? "Mantén actualizados los datos que identifican tu negocio." : "Tienes acceso de consulta a esta información."}
      </p>
      <div className={styles.fields}>
        {empresaFields.map(({ name, label, maxLength, fullWidth, optional, ...inputProps }) => (
          <TextField
            key={name}
            id={`empresa-${name}`}
            name={name}
            label={label}
            value={values[name]}
            onChange={onChange}
            required={!optional}
            disabled={busy}
            fullWidth
            type={inputProps.type || "text"}
            autoComplete={inputProps.autoComplete || "off"}
            className={fullWidth ? styles.fullWidth : undefined}
            error={Boolean(fieldErrors[name])}
            helperText={fieldErrors[name] || " "}
            slotProps={{
              input: { readOnly: !canUpdate },
              htmlInput: { maxLength, inputMode: inputProps.inputMode },
              formHelperText: { "aria-live": "polite" },
            }}
          />
        ))}
        <TextField
          select
          id="empresa-responsableIva"
          name="responsableIva"
          label="Responsabilidad de IVA"
          value={values.responsableIva}
          onChange={onChange}
          required
          disabled={busy || !canUpdate}
          fullWidth
          className={styles.fullWidth}
          error={Boolean(fieldErrors.responsableIva)}
          helperText={fieldErrors.responsableIva || "Selecciona la condición de la empresa según su RUT."}
          slotProps={{
            select: { native: true },
            inputLabel: { shrink: true },
            formHelperText: { "aria-live": "polite" },
          }}
        >
          <option value="true">Responsable de IVA</option>
          <option value="false">No responsable de IVA</option>
        </TextField>
      </div>
      {canUpdate && (
        <div className={styles.actions}>
          <span className={styles.changeStatus} role="status">
            {dirty ? "Tienes cambios sin guardar." : "La información está actualizada."}
          </span>
          <Button type="button" disabled={busy || !dirty} onClick={onReset}>Descartar cambios</Button>
          <Button type="submit" variant="contained" disabled={busy || !dirty}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      )}
    </form>
  );
}

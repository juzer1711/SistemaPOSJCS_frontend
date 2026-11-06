import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem, InputAdornment, IconButton,
} from "@mui/material";
import useAsyncFieldValidation from "./useAsyncFieldValidation.js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./CrudComponents.module.css";

const createInitialValues = (fields, initialValues) =>
  Object.fromEntries(fields.map(({ name }) => [name, initialValues?.[name] ?? ""]));

export default function CrudFormDialog({
  open,
  title,
  fields,
  initialValues,
  editing = false,
  onClose,
  onSubmit,
  submitLabel = editing ? "Guardar cambios" : "Crear",
}) {
  const [enabledOptionals, setEnabledOptionals] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [values, setValues] = useState(() => createInitialValues(fields, initialValues));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(createInitialValues(fields, initialValues));
      setErrors({});
      setFormError("");
      setEnabledOptionals({});
      setVisiblePasswords({});
    }
  }, [fields, initialValues, open]);

  const asyncValidation = useAsyncFieldValidation({ fields, values, open, editing });

  const handleChange = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFormError("");
  };

  const validate = () => {
    const nextErrors = {};
    for (const field of fields) {
      if (editing && field.optionalOnEdit && !enabledOptionals[field.name]) continue;
      const value = String(values[field.name] ?? "");
      if (field.required && !value.trim()) {
        nextErrors[field.name] = `${field.label} es obligatorio.`;
      } else if (value && field.minLength && value.length < field.minLength) {
        nextErrors[field.name] = `Mínimo ${field.minLength} caracteres.`;
      } else if (field.maxLength && value.length > field.maxLength) {
        nextErrors[field.name] = `Máximo ${field.maxLength} caracteres.`;
      } else if (value && field.pattern && !field.pattern.test(value)) {
        nextErrors[field.name] = field.patternMessage || "El formato no es válido.";
      } else if (field.validate) {
        nextErrors[field.name] = field.validate(value, values) || "";
      }
    }
    setErrors(nextErrors);
    return Object.values(nextErrors).every((message) => !message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting || !validate() || asyncValidation.blocked) return;

    setSubmitting(true);
    setFormError("");
    try {
      await onSubmit(values);
    } catch (error) {
      const response = error.response?.data;
      const serverFieldErrors = response?.fieldErrors || {};
      if (response?.field && response?.message && !serverFieldErrors[response.field]) {
        serverFieldErrors[response.field] = response.message;
      }
      setErrors((current) => ({ ...current, ...serverFieldErrors }));
      setFormError(
        Object.keys(serverFieldErrors).length
          ? ""
          : response?.message || error.message || "No fue posible guardar los cambios."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="crud-form-title"
    >
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle id="crud-form-title" className={styles.dialogTitle}>{title}</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          {formError && <Alert severity="error" className={styles.formAlert}>{formError}</Alert>}
          {Object.values(asyncValidation.states).some((state) => state?.status === "error") && (
            <Alert severity="warning" action={<Button onClick={asyncValidation.retry}>Reintentar</Button>}>
              No se pudo completar la validación de disponibilidad.
            </Alert>
          )}
          {fields.map((field) => editing && field.optionalOnEdit && !enabledOptionals[field.name] ? (
            <Button key={field.name} variant="outlined" disabled={submitting}
              onClick={() => setEnabledOptionals((current) => ({ ...current, [field.name]: true }))}>
              {field.enableLabel || field.label}
            </Button>
          ) : (
            <TextField
              key={field.name}
              className={styles.formField}
              label={field.label}
              name={field.name}
              value={values[field.name] ?? ""}
              onChange={(event) => handleChange(field.name, event.target.value)}
              placeholder={field.placeholder}
              select={Boolean(field.options)}
              type={field.type === "password" ? (visiblePasswords[field.name] ? "text" : "password") : field.type || "text"}
              InputProps={field.type === "password" ? { endAdornment: (
                <InputAdornment position="end"><IconButton type="button" disabled={submitting}
                  aria-label={visiblePasswords[field.name] ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setVisiblePasswords((current) => ({ ...current, [field.name]: !current[field.name] }))}>
                  {visiblePasswords[field.name] ? <VisibilityOff /> : <Visibility />}
                </IconButton></InputAdornment>
              ) } : undefined}
              required={field.required}
              disabled={submitting || (editing && field.disabledWhenEditing)}
              error={Boolean(errors[field.name] || asyncValidation.states[field.name]?.error)}
              helperText={errors[field.name] || asyncValidation.states[field.name]?.error
                || (asyncValidation.states[field.name]?.status === "pending" ? "Consultando disponibilidad…" : "")
                || (asyncValidation.states[field.name]?.status === "valid" ? field.availableMessage : "")
                || field.helperText || " "}
              multiline={field.multiline}
              minRows={field.minRows}
              inputProps={{
                maxLength: field.maxLength,
                inputMode: field.inputMode,
                "aria-describedby": (errors[field.name] || asyncValidation.states[field.name]?.error) ? `${field.name}-error` : undefined,
              }}
              FormHelperTextProps={{
                "aria-live": "polite",
                id: (errors[field.name] || asyncValidation.states[field.name]?.error) ? `${field.name}-error` : undefined,
              }}
              autoComplete={field.autoComplete || "off"}
              fullWidth
            >
              {field.options?.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </TextField>
          ))}
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={onClose} disabled={submitting}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={submitting || asyncValidation.blocked}>
            {submitting ? <CircularProgress size={21} color="inherit" /> : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

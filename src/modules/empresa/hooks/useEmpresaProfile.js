import { useEffect, useRef, useState } from "react";
import { useEmpresa } from "../../../context/EmpresaContext.jsx";
import { usePermissions } from "../../../context/PermissionsContext.jsx";
import { updateEmpresa, uploadLogo } from "../services/empresaApi.js";
import { empresaProfileSchema } from "../validation/empresaSchema.js";
import { empresaFieldErrors, empresaHasChanges, empresaProfileValues } from "../validation/empresaFields.js";

const createForm = (empresa) => ({
  id: empresa.idEmpresa,
  values: empresaProfileValues(empresa),
  original: empresaProfileValues(empresa),
});

export default function useEmpresaProfile() {
  const { empresa, empresaLoading, empresaError, cargarEmpresa, confirmarEmpresa } = useEmpresa();
  const { can } = usePermissions();
  const canUpdate = can("EMPRESA", "ACTUALIZACION");
  const [form, setForm] = useState(() => empresa ? createForm(empresa) : null);
  const [operation, setOperation] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [focusError, setFocusError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [logoError, setLogoError] = useState("");
  const pendingRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!canUpdate) {
      setFieldErrors({});
      setFocusError(null);
      setNotice(null);
      setLogoError("");
    }
    if (!empresa) {
      setForm(null);
      return;
    }
    // Un logo o una lectura del contexto no deben reemplazar un borrador pendiente.
    setForm((current) => canUpdate && current?.id === empresa.idEmpresa
      && empresaHasChanges(current.values, current.original) ? current : createForm(empresa));
  }, [empresa, canUpdate]);

  const dirty = Boolean(form && empresaHasChanges(form.values, form.original));
  const busy = Boolean(operation);

  const handleChange = ({ target: { name, value } }) => {
    if (!canUpdate || pendingRef.current) return;
    const nextValue = name === "responsableIva"
      ? value === "true" ? true : value === "false" ? false : ""
      : value;
    setForm((current) => ({ ...current, values: { ...current.values, [name]: nextValue } }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setNotice(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!canUpdate || pendingRef.current || !form || !dirty || empresaLoading || empresaError) return;
    pendingRef.current = true;
    setOperation("save");
    setFieldErrors({});
    setNotice(null);
    try {
      const payload = await empresaProfileSchema.validate(form.values, { abortEarly: false, stripUnknown: true });
      const saved = await updateEmpresa(form.id, payload);
      confirmarEmpresa(saved);
      if (mountedRef.current) {
        setForm(createForm(saved));
        setNotice({ severity: "success", message: "Empresa actualizada correctamente." });
      }
    } catch (error) {
      if (mountedRef.current) {
        const errors = empresaFieldErrors(error);
        setFieldErrors(errors);
        setFocusError(Object.keys(errors).length ? { name: Object.keys(errors)[0] } : null);
        setNotice({ severity: "error", message: Object.keys(errors).length
          ? "Revisa los campos indicados." : error.message || "No fue posible actualizar la empresa." });
      }
    } finally {
      pendingRef.current = false;
      if (mountedRef.current) setOperation("");
    }
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !canUpdate || pendingRef.current || !empresa || empresaLoading || empresaError) return;
    setLogoError("");
    if (!file.size || file.size > 2 * 1024 * 1024) {
      setLogoError("Selecciona una imagen de hasta 2 MB que no esté vacía.");
      return;
    }
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setLogoError("Solo se admiten imágenes PNG o JPEG.");
      return;
    }
    pendingRef.current = true;
    setOperation("logo");
    setNotice(null);
    try {
      const saved = await uploadLogo(file);
      confirmarEmpresa(saved);
      if (mountedRef.current) setNotice({ severity: "success", message: "Logo actualizado correctamente." });
    } catch (error) {
      if (mountedRef.current) setLogoError(error.message || "No fue posible actualizar el logo.");
    } finally {
      pendingRef.current = false;
      if (mountedRef.current) setOperation("");
    }
  };

  const resetForm = () => {
    if (pendingRef.current || !empresa) return;
    setForm(createForm(empresa));
    setFieldErrors({});
    setFocusError(null);
    setNotice(null);
  };

  return {
    empresa, loading: empresaLoading || (Boolean(empresa) && form?.id !== empresa.idEmpresa),
    error: empresaError, retry: cargarEmpresa, values: form?.values || empresaProfileValues(null),
    canUpdate, busy, saving: operation === "save", uploadingLogo: operation === "logo",
    dirty, notice, fieldErrors, focusError, logoError, handleChange, handleSave, handleLogoChange, resetForm,
  };
}

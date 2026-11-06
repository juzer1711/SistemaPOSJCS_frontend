import { useEffect, useState } from "react";
import { getEmpresa, updateEmpresa, uploadLogo } from "../../services/empresaService";
import { empresaSchema } from "../../validation/validationSchema";
import { useEmpresa } from "../../context/EmpresaContext";

export const useEmpresaProfile = () => {

  const { cargarEmpresa } = useEmpresa();

  const [empresa, setEmpresa]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [mensaje, setMensaje]           = useState("");
  const [mensajeSeverity, setMensajeSeverity] = useState("info");
  const [fieldErrors, setFieldErrors]   = useState({});

  useEffect(() => { loadEmpresa(); }, []);

  const loadEmpresa = async () => {
    try {
      const data = await getEmpresa();
      setEmpresa(data);
    } catch {
      showMensaje("No fue posible cargar la empresa", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMensaje = (texto, severity = "info") => {
    setMensaje(texto);
    setMensajeSeverity(severity);
    // Auto-ocultar después de 4 segundos
    setTimeout(() => setMensaje(""), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setFieldErrors({});
      await empresaSchema.validate(empresa, { abortEarly: false });
      await updateEmpresa(empresa.idEmpresa, empresa);
      await cargarEmpresa(); // actualiza el context global
      showMensaje("Empresa actualizada correctamente", "success");
    } catch (error) {
      if (error.inner) {
        const errors = error.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setFieldErrors(errors);
      } else {
        showMensaje(error.message || "Error al actualizar empresa", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño máximo 2MB en frontend
    if (file.size > 2 * 1024 * 1024) {
      showMensaje("La imagen no puede superar 2MB", "error");
      return;
    }

    try {
      setUploadingLogo(true);
      const data = await uploadLogo(file);
      setEmpresa((prev) => ({ ...prev, logo: data.logo }));
      await cargarEmpresa(); // actualiza el context global
      showMensaje("Logo actualizado correctamente", "success");
    } catch (error) {
      showMensaje(error.message || "Error al subir el logo", "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  return {
    empresa, loading, saving, uploadingLogo,
    mensaje, mensajeSeverity, fieldErrors,
    handleChange, handleSave, handleLogoChange,
  };
};
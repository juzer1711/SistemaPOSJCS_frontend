import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmpresa } from "../../../context/EmpresaContext";
import { createEmpresa } from "../services/empresaApi.js";
import { empresaSchema } from "../../../validation/validationSchema";

const initialEmpresa = {
  nombreComercial: "",
  razonSocial: "",
  nit: "",
  digitoVerificacion: "",
  direccion: "",
  municipio: "",
  departamento: "",
  telefono: "",
  correo: "",
};

export const useRegistroEmpresa = () => {
  const navigate = useNavigate();
  const { registrarEmpresa } = useEmpresa();
  const [empresa, setEmpresa] = useState(initialEmpresa);
  const [setupToken, setSetupToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "setupToken") {
      setSetupToken(value);
    } else {
      setEmpresa((current) => ({ ...current, [name]: value }));
    }

    setFieldErrors((current) => current[name] ? { ...current, [name]: "" } : current);
    setMensaje("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setMensaje("");
    setFieldErrors({});

    try {
      if (!setupToken.trim()) {
        setFieldErrors({ setupToken: "La clave de configuración inicial es obligatoria." });
        return;
      }

      const validatedEmpresa = await empresaSchema.validate(empresa, {
        abortEarly: false,
        stripUnknown: true,
      });
      const createdEmpresa = await createEmpresa(validatedEmpresa, setupToken);
      registrarEmpresa(createdEmpresa);
      setSetupToken("");
      navigate("/login", { replace: true });
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = error.inner.reduce((current, validationError) => {
          if (validationError.path && !current[validationError.path]) {
            current[validationError.path] = validationError.message;
          }
          return current;
        }, {});
        setFieldErrors(errors);
      } else {
        setMensaje(error.message || "No fue posible registrar la empresa.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    empresa,
    setupToken,
    loading,
    mensaje,
    fieldErrors,
    handleChange,
    handleSubmit,
  };
};

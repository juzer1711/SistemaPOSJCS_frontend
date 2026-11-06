import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { loginSchema } from "../validation/loginSchema.js";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setFieldErrors((current) => ({ ...current, username: "" }));
    setMensaje("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setFieldErrors((current) => ({ ...current, password: "" }));
    setMensaje("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setMensaje("");
    setFieldErrors({});

    try {
      await loginSchema.validate({ username, password }, { abortEarly: false });
    } catch (validationError) {
      if (validationError.name !== "ValidationError") {
        throw validationError;
      }

      const errors = validationError.inner.reduce((current, error) => {
        if (error.path && !current[error.path]) {
          current[error.path] = error.message;
        }
        return current;
      }, {});
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      navigate("/admin-dashboard", { replace: true });
    } catch (error) {
      setMensaje(
        error.response?.data?.message
          || error.message
          || "No fue posible iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    password,
    mensaje,
    fieldErrors,
    loading,
    handleUsernameChange,
    handlePasswordChange,
    handleSubmit,
  };
};

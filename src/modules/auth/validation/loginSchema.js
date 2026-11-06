import * as yup from "yup";

export const loginSchema = yup.object({
  username: yup.string().required("El usuario es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria"),
});

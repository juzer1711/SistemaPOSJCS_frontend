import * as yup from "yup";

export const empresaSchema = yup.object().shape({
  nombreComercial: yup
    .string()
    .trim()
    .required("El nombre comercial es obligatorio")
    .max(150, "Máximo 150 caracteres"),

  razonSocial: yup
    .string()
    .trim()
    .required("La razón social es obligatoria")
    .max(150, "Máximo 150 caracteres"),

  nit: yup
    .string()
    .trim()
    .required("El NIT es obligatorio")
    .matches(/^[0-9]{5,15}$/, "El NIT debe tener entre 5 y 15 dígitos, sin guiones"),

  digitoVerificacion: yup
    .string()
    .trim()
    .required("El dígito de verificación es obligatorio")
    .matches(/^[0-9]$/, "El dígito de verificación debe ser un dígito"),

  direccion: yup
    .string()
    .trim()
    .required("La dirección es obligatoria")
    .max(255, "Máximo 255 caracteres"),

  municipio: yup
    .string()
    .trim()
    .required("El municipio es obligatorio")
    .max(100, "Máximo 100 caracteres"),

  departamento: yup
    .string()
    .trim()
    .required("El departamento es obligatorio")
    .max(100, "Máximo 100 caracteres"),

  telefono: yup
    .string()
    .trim()
    .required("El teléfono es obligatorio")
    .matches(
      /^[0-9+()\- ]{7,20}$/,
      "El teléfono debe tener entre 7 y 20 caracteres válidos"
    ),

  correo: yup.string()
    .transform((value) => typeof value === "string" ? value.trim() || null : value)
    .nullable()
    .notRequired()
    .email("Correo inválido")
    .max(150, "El correo no puede superar 150 caracteres"),
});

// El registro inicial conserva su contrato; el perfil exige una seleccion explicita.
export const empresaProfileSchema = empresaSchema.shape({
  responsableIva: yup.boolean()
    .strict()
    .typeError("Selecciona si la empresa es responsable de IVA")
    .required("Selecciona si la empresa es responsable de IVA"),
});

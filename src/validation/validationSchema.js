import * as yup from "yup";

export const productSchema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre del producto es obligatorio"),

  categoriaId: yup
    .number()
    .typeError("Debe seleccionar una categoría")
    .required("La categoría es obligatoria"),
  
  codigoBarras: yup
    .string()
    .required("El codigo de barras es obligatorio")
    .matches(/^[0-9]{6,20}$/, "El codigo de barras debe tener entre 6 y 20 dígitos numéricos"),
  
  descripcion: yup
  .string(),
    
  costo: yup
    .number()
    .typeError("El costo debe ser un número")
    .positive("El costo debe ser mayor a 0")
    .required("El costo es obligatorio"),

  precioventa: yup
    .number()
    .typeError("El precio de venta debe ser un número")
    .positive("El precio debe ser mayor a 0")
    .required("El precio de venta es obligatorio"),
  
  iva: yup
    .string()
    .oneOf(["IVA_0", "IVA_5", "IVA_19"], "IVA inválido")
    .required("El tipo de documento es obligatorio"),
});
export const categoriaSchema = yup.object().shape({
    nombre: yup
    .string()
    .required("El nombre de la categoria es obligatorio"),
})

export const clientSchema = yup.object().shape({
  tipoCliente: yup
    .string()
    .oneOf(["PERSONA_NATURAL", "EMPRESA"], "Tipo de cliente no válido")
    .required("El tipo de cliente es obligatorio"),

  // ===========================
  // PERSONA NATURAL
  // ===========================
  primerNombre: yup.string().when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
      schema
        .required("El primer nombre es obligatorio")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "Solo se permiten letras y espacios"),
    otherwise: (schema) => schema.strip(), // elimina el campo si no aplica
  }),

  segundoNombre: yup.string()
  .nullable() 
  .notRequired()
  .when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
      schema.matches(/^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/, "Solo se permiten letras y espacios"),
    otherwise: (schema) => schema.strip(),
  }),

  primerApellido: yup.string().when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
      schema
        .required("El primer apellido es obligatorio")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "Solo se permiten letras y espacios"),
    otherwise: (schema) => schema.strip(),
  }),

  segundoApellido: yup.string()
  .nullable() 
  .notRequired()
  .when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
      schema.matches(/^$|^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/, "Solo se permiten letras y espacios"),
    otherwise: (schema) => schema.strip(),
  }),

  tipoDocumento: yup.string().when("tipoCliente", {
    is: "PERSONA_NATURAL",
    then: (schema) =>
    schema.oneOf(["CEDULA_CIUDADANIA", "CEDULA_EXTRANJERIA","TARJETA_EXTRANJERIA","PASAPORTE","PEP"], "Tipo de documento no válido")
    .required("El tipo de documento es obligatorio"),
    }),

  // ===========================
  // EMPRESA
  // ===========================
  razonSocial: yup.string().when("tipoCliente", {
    is: "EMPRESA",
    then: (schema) =>
      schema.required("La razón social es obligatoria"),
    otherwise: (schema) => schema.strip(),
  }),

  identificadorNit: yup.string().when("tipoCliente", {
    is: "EMPRESA",
    then: (schema) =>
      schema
        .required("El dígito verificador del NIT es obligatorio")
        .matches(/^[0-9]{1}$/, "Debe ser un dígito entre 0 y 9"),
    otherwise: (schema) => schema.strip(),
  }),

  tipoDocumento: yup.string().when("tipoCliente", {
    is: "EMPRESA",
    then: (schema) =>
    schema.oneOf(["NIT"], "Tipo de documento no válido")
    .required("El tipo de documento es obligatorio"),
    }),

  // ===========================
  // CAMPOS COMUNES
  // ===========================

  documento: yup
      .string()
      .required("El documento es obligatorio")
      .matches(/^[0-9]{6,12}$/, "El documento debe tener entre 6 y 12 dígitos numéricos"),

  email: yup
    .string()
    .email("El correo no es válido")
    .required("El correo es obligatorio"),

  telefono: yup
    .string()
    .required("El teléfono es obligatorio")
    .matches(/^[0-9]{7,10}$/, "Debe tener entre 7 y 10 dígitos"),
});

export const ventaSchema = yup.object().shape({
  cliente: yup.object()
    .required("Selecciona un cliente antes de continuar"),

  metodoPago: yup.string()
    .required("Elige un método de pago"),

  items: yup.array()
    .min(1, "Agrega al menos un producto a la venta")
    .of(
      yup.object().shape({
        idProducto: yup.number().required(),
        cantidad: yup.number()
          .min(1, "Cantidad mínima 1")
          .required(),
        precio: yup.number().required(),
      })
    ),

  observaciones: yup.string()
    .max(255, "Máximo 255 caracteres")
});

export const abrirCajaSchema = yup.object().shape({
  usuario: yup
    .object()
    .required("Debes seleccionar un cajero"),

  montoInicial: yup
    .number()
    .typeError("El monto debe ser numérico")
    .positive("El monto debe ser mayor a 0")
    .required("El monto inicial es obligatorio"),
});

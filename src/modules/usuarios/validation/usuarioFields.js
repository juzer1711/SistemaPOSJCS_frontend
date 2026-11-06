const letters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
const DOCUMENT_LABELS = {
  CEDULA_CIUDADANIA: "Cédula de ciudadanía", CEDULA_EXTRANJERIA: "Cédula de extranjería",
  TARJETA_EXTRANJERIA: "Tarjeta de extranjería", PASAPORTE: "Pasaporte", NIT: "NIT", PEP: "Permiso especial de permanencia",
};
export const documentOptions = (types) => types.map((value) => ({ value, label: DOCUMENT_LABELS[value] || value }));
export const EMPTY_USUARIO = { username: "", password: "", primerNombre: "", segundoNombre: "",
  primerApellido: "", segundoApellido: "", tipoDocumento: "", documento: "", email: "", telefono: "" };

export const usuarioFields = (types, editing) => [
  { name: "username", label: "Usuario", required: true, minLength: 3, maxLength: 50, autoComplete: "off" },
  { name: "password", label: editing ? "Nueva contraseña" : "Contraseña", type: "password",
    required: !editing, optionalOnEdit: true, enableLabel: "Cambiar contraseña", minLength: 6, maxLength: 72,
    autoComplete: "new-password", validate: (value) => value && new TextEncoder().encode(value).length > 72
      ? "La contraseña no puede superar 72 bytes UTF-8." : "" },
  ...[
    ["primerNombre", "Primer nombre", true], ["segundoNombre", "Segundo nombre", false],
    ["primerApellido", "Primer apellido", true], ["segundoApellido", "Segundo apellido", false],
  ].map(([name, label, required]) => ({ name, label, required, maxLength: 100, pattern: letters, patternMessage: "Solo se permiten letras y espacios." })),
  { name: "tipoDocumento", label: "Tipo de documento", required: true, options: documentOptions(types),
    validate: (value) => types.includes(value) ? "" : "Selecciona un tipo de documento válido." },
  { name: "documento", label: "Documento", required: true, maxLength: 12, pattern: /^[0-9]{6,12}$/,
    patternMessage: "Debe contener entre 6 y 12 dígitos.", disabledWhenEditing: true,
    helperText: editing ? "El documento no se puede modificar." : "", inputMode: "numeric" },
  { name: "email", label: "Correo electrónico", type: "email", required: true, maxLength: 150,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMessage: "Ingresa un correo válido." },
  { name: "telefono", label: "Teléfono", required: true, maxLength: 10, pattern: /^[0-9]{7,10}$/,
    patternMessage: "Debe contener entre 7 y 10 dígitos.", inputMode: "tel" },
];

export function usuarioPayload(values) {
  const payload = Object.fromEntries(Object.keys(EMPTY_USUARIO).filter((key) => key !== "password")
    .map((key) => [key, String(values[key] ?? "").trim()]));
  if (values.password) payload.password = values.password;
  return payload;
}
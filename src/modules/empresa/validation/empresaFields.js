export const empresaFields = [
  { name: "nombreComercial", label: "Nombre comercial", maxLength: 150, autoComplete: "organization" },
  { name: "razonSocial", label: "Razón social", maxLength: 150, autoComplete: "organization" },
  { name: "nit", label: "NIT (sin dígito de verificación)", maxLength: 15, inputMode: "numeric" },
  { name: "digitoVerificacion", label: "Dígito de verificación", maxLength: 1, inputMode: "numeric" },
  { name: "direccion", label: "Dirección", maxLength: 255, autoComplete: "street-address", fullWidth: true },
  { name: "municipio", label: "Municipio", maxLength: 100, autoComplete: "address-level2" },
  { name: "departamento", label: "Departamento", maxLength: 100, autoComplete: "address-level1" },
  { name: "telefono", label: "Teléfono", maxLength: 20, autoComplete: "tel", inputMode: "tel" },
  { name: "correo", label: "Correo (opcional)", maxLength: 150, autoComplete: "email", type: "email", optional: true },
];

export const empresaValues = (empresa) => Object.fromEntries(
  empresaFields.map(({ name }) => [name, empresa?.[name] ?? ""])
);

const empresaProfileFields = [...empresaFields, { name: "responsableIva" }];

export const empresaProfileValues = (empresa) => ({
  ...empresaValues(empresa),
  responsableIva: empresa?.responsableIva ?? "",
});

export const empresaHasChanges = (values, original) => empresaProfileFields.some(
  ({ name }) => values[name] !== original[name]
);

export const empresaFieldErrors = (error) => {
  const errors = error.name === "ValidationError"
    ? Object.fromEntries(error.inner.map(({ path, message }) => [path, message]))
    : { ...error.raw?.fieldErrors };
  if (error.raw?.field && error.raw.message && !errors[error.raw.field]) {
    errors[error.raw.field] = error.raw.message;
  }
  return Object.fromEntries(empresaProfileFields.filter(({ name }) => errors[name])
    .map(({ name }) => [name, errors[name]]));
};

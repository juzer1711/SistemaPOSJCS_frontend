import { test } from "node:test";
import assert from "node:assert/strict";
import { empresaSchema, empresaProfileSchema } from "../src/modules/empresa/validation/empresaSchema.js";
import { empresaFieldErrors, empresaHasChanges, empresaProfileValues, empresaValues } from "../src/modules/empresa/validation/empresaFields.js";

const validEmpresa = {
  nombreComercial: "Comercial POS", razonSocial: "Comercial POS S.A.S.",
  nit: "900123456", digitoVerificacion: "7", direccion: "Calle 10",
  municipio: "Bogotá", departamento: "Cundinamarca", telefono: "+57 (601) 555-1234", correo: "contacto@example.com",
};

test("el payload normaliza los datos y excluye id, logo y estado", async () => {
  const payload = await empresaSchema.validate({
    ...validEmpresa, nombreComercial: "  Comercial POS  ", correo: "   ",
    idEmpresa: 1, logo: "https://example.com/logo.png", estado: false,
  }, { abortEarly: false, stripUnknown: true });
  assert.deepEqual(payload, { ...validEmpresa, nombreComercial: "Comercial POS", correo: null });
});

test("los tres campos ausentes en el perfil legacy son obligatorios y tienen error visible", async () => {
  try {
    await empresaSchema.validate({ ...validEmpresa, digitoVerificacion: "", municipio: "", departamento: "" }, { abortEarly: false });
    assert.fail("Debió rechazar los campos vacíos");
  } catch (error) {
    assert.deepEqual(Object.keys(empresaFieldErrors(error)).sort(), ["departamento", "digitoVerificacion", "municipio"]);
  }
});

test("la validación mantiene los límites y formatos del contrato", async () => {
  for (const [name, value] of [
    ["nombreComercial", "x".repeat(151)], ["razonSocial", "x".repeat(151)],
    ["nit", "1234"], ["nit", "900123456-7"], ["nit", "1".repeat(16)],
    ["digitoVerificacion", "12"], ["direccion", "x".repeat(256)],
    ["municipio", "x".repeat(101)], ["departamento", "x".repeat(101)],
    ["telefono", "555.1234"], ["telefono", "123456"], ["correo", "correo-invalido"],
  ]) {
    await assert.rejects(empresaSchema.validate({ ...validEmpresa, [name]: value }), { name: "ValidationError" });
  }
  await empresaSchema.validate({ ...validEmpresa, correo: null });
});

test("el borrador solo incluye campos editables y un cambio de logo no lo ensucia", () => {
  const values = empresaValues(validEmpresa);
  assert.equal(empresaHasChanges(values, empresaValues({ ...validEmpresa, logo: "otro", estado: false })), false);
  assert.equal(empresaHasChanges({ ...values, municipio: "Medellín" }, values), true);
  assert.equal(empresaValues({ ...validEmpresa, correo: null }).correo, "");
});

test("los errores del servidor se asocian únicamente a campos del dominio", () => {
  assert.deepEqual(empresaFieldErrors({ raw: {
    fieldErrors: { municipio: "Municipio inválido", otro: "No mostrar" },
    field: "nit", message: "NIT inválido",
  } }), { nit: "NIT inválido", municipio: "Municipio inválido" });
  assert.deepEqual(empresaFieldErrors(new Error("Sin conexión")), {});
});

test("el perfil envia true y false como booleanos sin perder el campo al construir el payload", async () => {
  for (const responsableIva of [true, false]) {
    const payload = await empresaProfileSchema.validate({
      ...empresaProfileValues({ ...validEmpresa, responsableIva }),
      idEmpresa: 1, logo: "https://example.com/logo.png", estado: true,
    }, { abortEarly: false, stripUnknown: true });
    assert.deepEqual(payload, { ...validEmpresa, responsableIva });
    assert.equal(JSON.parse(JSON.stringify(payload)).responsableIva, responsableIva);
  }
});

test("el perfil exige seleccion explicita sin admitir textos o numeros como condicion tributaria", async () => {
  for (const responsableIva of [undefined, null, "", "true", "false", 0, 1]) {
    await assert.rejects(
      empresaProfileSchema.validate({ ...validEmpresa, responsableIva }, { abortEarly: false }),
      (error) => Boolean(empresaFieldErrors(error).responsableIva),
    );
  }
  // El registro inicial no incorpora la nueva obligacion del perfil.
  await empresaSchema.validate(validEmpresa);
});

test("pendiente no equivale a false y los cambios tributarios participan en el borrador", () => {
  const pending = empresaProfileValues({ ...validEmpresa, responsableIva: null });
  const noResponsable = empresaProfileValues({ ...validEmpresa, responsableIva: false });
  const responsable = empresaProfileValues({ ...validEmpresa, responsableIva: true });
  assert.equal(pending.responsableIva, "");
  assert.equal(empresaProfileValues(validEmpresa).responsableIva, "");
  assert.equal(noResponsable.responsableIva, false);
  assert.equal(empresaHasChanges(noResponsable, pending), true);
  assert.equal(empresaHasChanges(noResponsable, responsable), true);
  assert.equal(empresaHasChanges(noResponsable, empresaProfileValues({
    ...validEmpresa, responsableIva: false, logo: "otro",
  })), false);
  assert.deepEqual(empresaFieldErrors({ raw: { fieldErrors: {
    responsableIva: "Condicion invalida",
  } } }), { responsableIva: "Condicion invalida" });
});

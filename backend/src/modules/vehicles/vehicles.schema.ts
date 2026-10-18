import { z } from "zod";
import { badRequest } from "../../shared/errors";

// Formato de placa de SIGME, alineado con la validación ya existente en la
// app móvil (app-movil/src/hooks/useRegistroForm.ts):
//   /^[A-Z0-9]{3}-?[A-Z0-9]{3,4}$/i
// Es decir: 3 caracteres alfanuméricos, guion opcional y 3-4 alfanuméricos.
// Ejemplos válidos: ABC123, ABC-123, ABC1234, AB1-234 (mayúsculas o minúsculas).
const PLACA_REGEX = /^[A-Z0-9]{3}-?[A-Z0-9]{3,4}$/i;
const PLACA_MSG = "Placa inválida (formato esperado: ej. ABC-123)";

// Normalización explícita y documentada: mayúsculas y sin guion.
// Así "abc-123", "ABC123" y "ABC-123" representan la misma placa y no
// generan registros duplicados en la base de datos.
export function normalizarPlaca(placa: string): string {
  return placa.toUpperCase().replace(/-/g, "");
}

// marca y modelo son opcionales y admiten NULL en la base de datos.
const textoOpcional = z.string().trim().max(100).optional().nullable();

export const crearVehiculoSchema = z.object({
  placa: z
    .string()
    .trim()
    .min(1, "La placa es obligatoria")
    .regex(PLACA_REGEX, PLACA_MSG)
    .transform(normalizarPlaca),
  marca: textoOpcional,
  modelo: textoOpcional,
});

export const actualizarVehiculoSchema = z
  .object({
    placa: z
      .string()
      .trim()
      .min(1, "La placa no puede estar vacía")
      .regex(PLACA_REGEX, PLACA_MSG)
      .transform(normalizarPlaca)
      .optional(),
    marca: textoOpcional,
    modelo: textoOpcional,
  })
  .refine((d) => Object.keys(d).length > 0, "Envía al menos un campo");

export function validar<T>(schema: z.ZodType<T>, data: unknown): T {
  const r = schema.safeParse(data);
  if (!r.success) {
    const detalle = r.error.issues
      .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
      .join("; ");
    throw badRequest(detalle);
  }
  return r.data;
}

export function validarId(valor: string): number {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) throw badRequest("Id inválido");
  return id;
}

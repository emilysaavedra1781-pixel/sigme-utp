import { z } from "zod";
import { badRequest } from "../../shared/errors";

export const loginSchema = z.object({
  codigo: z.string().trim().min(1, "El código es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

// Nota: no incluye "rol". Si el cliente lo manda, se ignora.
export const registroSchema = z.object({
  codigo: z.string().trim().min(3).max(20),
  nombre: z.string().trim().min(2).max(100),
  email: z.string().trim().email("Correo inválido"),
  dni: z.string().trim().min(8).max(12),
  licencia: z.string().trim().max(30).optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

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
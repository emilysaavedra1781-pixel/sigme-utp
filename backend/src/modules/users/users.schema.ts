import { z } from "zod";
import { badRequest } from "../../shared/errors";

export const ROLES = ["usuario", "supervisor", "administrador"] as const;
export const ESTADOS = ["activo", "inactivo", "bloqueado"] as const;

export const crearUsuarioSchema = z.object({
  codigo: z.string().trim().min(3).max(20),
  nombre: z.string().trim().min(2).max(100),
  email: z.string().trim().email("Correo inválido"),
  dni: z.string().trim().min(8).max(12),
  licencia: z.string().trim().max(30).optional(),
  rol: z.enum(ROLES),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

// Todos opcionales, pero al menos uno debe venir
export const actualizarPerfilSchema = z
  .object({
    nombre: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().email("Correo inválido").optional(),
    licencia: z.string().trim().max(30).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, "Envía al menos un campo");

export const estadoSchema = z.object({ estado: z.enum(ESTADOS) });
export const rolSchema = z.object({ rol: z.enum(ROLES) });

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
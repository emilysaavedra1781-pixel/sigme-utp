import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors";
import { logger } from "../config/logger";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Errores controlados (400, 401, 403, 404, 409...)
  if (err instanceof AppError) {
    logger.warn({ event: "http.app_error", status: err.status }, err.message);
    return res.status(err.status).json({ error: err.message });
  }

  // Violación de unicidad en PostgreSQL
  if (typeof err === "object" && err !== null && (err as { code?: string }).code === "23505") {
    const constraint = (err as { constraint?: string }).constraint;

    // Placa de vehículo duplicada (restricción vehicles_placa_key)
    if (constraint === "vehicles_placa_key") {
      logger.warn({ event: "db.unique_violation", constraint }, "Placa duplicada");
      return res.status(409).json({ error: "La placa ya está registrada" });
    }

    // Resto de unicidades (código o correo de usuario)
    logger.warn({ event: "db.unique_violation", constraint }, "Registro duplicado");
    return res.status(409).json({ error: "El código o correo ya existe" });
  }

  // Cualquier otra cosa es un error inesperado (500)
  logger.error({ event: "http.unhandled_error", err }, "Error no controlado");
  return res.status(500).json({ error: "Error interno del servidor" });
}
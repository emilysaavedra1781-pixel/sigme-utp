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

  // Violación de unicidad en PostgreSQL (código o correo repetido)
  if (typeof err === "object" && err !== null && (err as { code?: string }).code === "23505") {
    logger.warn({ event: "db.unique_violation" }, "Registro duplicado");
    return res.status(409).json({ error: "El código o correo ya existe" });
  }

  // Cualquier otra cosa es un error inesperado (500)
  logger.error({ event: "http.unhandled_error", err }, "Error no controlado");
  return res.status(500).json({ error: "Error interno del servidor" });
}
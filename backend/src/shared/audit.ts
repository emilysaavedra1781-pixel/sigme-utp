import { pool } from "../db/pool";
import { logger } from "../config/logger";

export async function registrarAuditoria(
  usuarioId: number | null,
  accion: string,
  elemento: string,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO audit_log (usuario_id, accion, elemento_afectado)
       VALUES ($1, $2, $3)`,
      [usuarioId, accion, elemento],
    );
  } catch (err) {
    logger.error({ event: "audit.failed", err, accion }, "No se pudo registrar la auditoría");
  }
}
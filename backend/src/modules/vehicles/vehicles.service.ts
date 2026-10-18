import { pool } from "../../db/pool";
import { logger } from "../../config/logger";
import { registrarAuditoria } from "../../shared/audit";
import { notFound } from "../../shared/errors";

type CrearDatos = { placa: string; marca?: string | null; modelo?: string | null };
type ActualizarDatos = { placa?: string; marca?: string | null; modelo?: string | null };

// Campos que se devuelven al cliente (nunca incluye datos privados del usuario).
const CAMPOS = "id, user_id, placa, marca, modelo, fecha_registro";

// Cuando una consulta con filtro de propietario no devuelve filas, distingue
// "no existe" de "existe pero es ajeno" únicamente para registrar un warning.
// La respuesta al cliente es siempre 404 para no revelar si el recurso existe.
async function advertirAccesoAjeno(evento: string, userId: number, vehicleId: number): Promise<void> {
  const { rows } = await pool.query(`SELECT id FROM vehicles WHERE id = $1`, [vehicleId]);
  if (rows[0]) {
    logger.warn({ event: evento, userId, vehicleId }, "Intento de acceso a un vehículo ajeno");
  }
}

export async function crear(userId: number, d: CrearDatos) {
  const { rows } = await pool.query(
    `INSERT INTO vehicles (user_id, placa, marca, modelo)
     VALUES ($1, $2, $3, $4)
     RETURNING ${CAMPOS}`,
    [userId, d.placa, d.marca || null, d.modelo || null],
  );
  const vehiculo = rows[0];
  await registrarAuditoria(userId, "vehicles.create", `vehicles:${vehiculo.id}`);
  logger.info({ event: "vehicles.created", userId, vehicleId: vehiculo.id }, "Vehículo creado");
  return vehiculo;
}

export async function listarPropios(userId: number) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS} FROM vehicles WHERE user_id = $1 ORDER BY id`,
    [userId],
  );
  return rows;
}

export async function obtener(userId: number, id: number) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS} FROM vehicles WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  if (rows[0]) return rows[0];
  await advertirAccesoAjeno("vehicles.read_forbidden", userId, id);
  throw notFound("Vehículo no encontrado");
}

export async function actualizar(userId: number, id: number, d: ActualizarDatos) {
  // Distingue "omitido" (mantener el valor) de "null/cadena vacía explícita"
  // (limpiar el valor). Los booleanos indican si el campo venía en el cuerpo.
  const setPlaca = d.placa !== undefined;
  const setMarca = d.marca !== undefined;
  const setModelo = d.modelo !== undefined;

  const { rows } = await pool.query(
    `UPDATE vehicles
     SET placa  = CASE WHEN $1 THEN $2 ELSE placa END,
         marca  = CASE WHEN $3 THEN $4 ELSE marca END,
         modelo = CASE WHEN $5 THEN $6 ELSE modelo END
     WHERE id = $7 AND user_id = $8
     RETURNING ${CAMPOS}`,
    [
      setPlaca, d.placa ?? null,
      setMarca, d.marca || null,
      setModelo, d.modelo || null,
      id, userId,
    ],
  );
  if (!rows[0]) {
    await advertirAccesoAjeno("vehicles.update_forbidden", userId, id);
    throw notFound("Vehículo no encontrado");
  }
  await registrarAuditoria(userId, "vehicles.update", `vehicles:${id}`);
  logger.info({ event: "vehicles.updated", userId, vehicleId: id }, "Vehículo actualizado");
  return rows[0];
}

export async function eliminar(userId: number, id: number) {
  const { rowCount } = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  if (!rowCount) {
    await advertirAccesoAjeno("vehicles.delete_forbidden", userId, id);
    throw notFound("Vehículo no encontrado");
  }
  await registrarAuditoria(userId, "vehicles.delete", `vehicles:${id}`);
  logger.info({ event: "vehicles.deleted", userId, vehicleId: id }, "Vehículo eliminado");
  return { eliminado: true, id };
}

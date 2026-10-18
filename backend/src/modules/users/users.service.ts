import bcrypt from "bcrypt";
import { pool } from "../../db/pool";
import { registrarAuditoria } from "../../shared/audit";
import { badRequest, notFound } from "../../shared/errors";
import type { Rol, Estado } from "../../shared/types";

// Campos públicos: nunca incluye password_hash
const CAMPOS_PERFIL = "id, codigo, nombre, email, dni, licencia, rol, estado, fecha_registro";
// El listado tampoco incluye dni ni licencia
const CAMPOS_LISTA = "id, codigo, nombre, email, rol, estado, fecha_registro";

export async function obtenerPerfil(id: number) {
  const { rows } = await pool.query(`SELECT ${CAMPOS_PERFIL} FROM users WHERE id = $1`, [id]);
  if (!rows[0]) throw notFound("Usuario no encontrado");
  return rows[0];
}

export async function listar() {
  const { rows } = await pool.query(`SELECT ${CAMPOS_LISTA} FROM users ORDER BY id`);
  return rows;
}

export async function crear(
  adminId: number,
  d: { codigo: string; nombre: string; email: string; dni: string; licencia?: string; rol: Rol; password: string },
) {
  const hash = await bcrypt.hash(d.password, 10);
  const { rows } = await pool.query(
    `INSERT INTO users (codigo, nombre, email, dni, licencia, rol, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${CAMPOS_LISTA}`,
    [d.codigo, d.nombre, d.email, d.dni, d.licencia ?? null, d.rol, hash],
  );
  await registrarAuditoria(adminId, "users.create", `users:${rows[0].id}`);
  return rows[0];
}

export async function actualizarPerfil(
  id: number,
  d: { nombre?: string; email?: string; licencia?: string },
) {
  const { rows } = await pool.query(
    `UPDATE users
     SET nombre   = COALESCE($1, nombre),
         email    = COALESCE($2, email),
         licencia = COALESCE($3, licencia)
     WHERE id = $4
     RETURNING ${CAMPOS_PERFIL}`,
    [d.nombre ?? null, d.email ?? null, d.licencia ?? null, id],
  );
  if (!rows[0]) throw notFound("Usuario no encontrado");
  await registrarAuditoria(id, "users.update_perfil", `users:${id}`);
  return rows[0];
}

export async function cambiarEstado(adminId: number, id: number, estado: Estado) {
  const { rows } = await pool.query(
    `UPDATE users SET estado = $1 WHERE id = $2 RETURNING ${CAMPOS_LISTA}`,
    [estado, id],
  );
  if (!rows[0]) throw notFound("Usuario no encontrado");
  await registrarAuditoria(adminId, `users.estado.${estado}`, `users:${id}`);
  return rows[0];
}

export async function cambiarRol(adminId: number, id: number, rol: Rol) {
  const { rows } = await pool.query(
    `UPDATE users SET rol = $1 WHERE id = $2 RETURNING ${CAMPOS_LISTA}`,
    [rol, id],
  );
  if (!rows[0]) throw notFound("Usuario no encontrado");
  await registrarAuditoria(adminId, `users.rol.${rol}`, `users:${id}`);
  return rows[0];
}

export async function bajaLogica(id: number) {
  const { rows } = await pool.query(
    `UPDATE users SET estado = 'inactivo' WHERE id = $1 RETURNING ${CAMPOS_LISTA}`,
    [id],
  );
  if (!rows[0]) throw notFound("Usuario no encontrado");
  await registrarAuditoria(id, "users.baja", `users:${id}`);
  return rows[0];
}

export async function eliminar(adminId: number, id: number) {
  if (adminId === id) throw badRequest("Un administrador no puede eliminarse a sí mismo");
  const { rowCount } = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  if (!rowCount) throw notFound("Usuario no encontrado");
  await registrarAuditoria(adminId, "users.delete", `users:${id}`);
  return { eliminado: true, id };
}
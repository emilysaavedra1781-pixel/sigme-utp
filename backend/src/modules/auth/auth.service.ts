import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../db/pool";
import { env } from "../../config/env";
import { forbidden, unauthorized } from "../../shared/errors";

export async function login(codigo: string, password: string) {
  const { rows } = await pool.query(
    `SELECT id, codigo, nombre, rol, estado, password_hash
     FROM users WHERE codigo = $1`,
    [codigo],
  );
  const u = rows[0];

  // Mismo mensaje si no existe o la clave es incorrecta
  if (!u || !(await bcrypt.compare(password, u.password_hash))) {
    throw unauthorized("Credenciales inválidas");
  }

  if (u.estado !== "activo") {
    throw forbidden("Tu cuenta no está activa");
  }

  const token = jwt.sign(
    { id: u.id, codigo: u.codigo, rol: u.rol },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );

  return {
    token,
    usuario: { id: u.id, codigo: u.codigo, nombre: u.nombre, rol: u.rol },
  };
}

export async function registro(datos: {
  codigo: string;
  nombre: string;
  email: string;
  dni: string;
  licencia?: string;
  password: string;
}) {
  const hash = await bcrypt.hash(datos.password, 10);

  // El rol siempre es "usuario", sin importar lo que mande el cliente
  const { rows } = await pool.query(
    `INSERT INTO users (codigo, nombre, email, dni, licencia, rol, password_hash)
     VALUES ($1, $2, $3, $4, $5, 'usuario', $6)
     RETURNING id, codigo, nombre, email, rol, estado`,
    [datos.codigo, datos.nombre, datos.email, datos.dni, datos.licencia ?? null, hash],
  );
  return rows[0];
}
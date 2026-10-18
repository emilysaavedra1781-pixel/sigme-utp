import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { unauthorized } from "../shared/errors";
import type { UsuarioToken } from "../shared/types";

export function validarToken(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("authorization");

  if (!header || !header.startsWith("Bearer ")) {
    throw unauthorized("Falta el token");
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as UsuarioToken;
    req.user = { id: payload.id, codigo: payload.codigo, rol: payload.rol };
    next();
  } catch {
    throw unauthorized("Token inválido o vencido");
  }
}
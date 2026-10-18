import type { Request, Response } from "express";
import { loginSchema, registroSchema, validar } from "./auth.schema";
import * as service from "./auth.service";

export async function login(req: Request, res: Response) {
  const { codigo, password } = validar(loginSchema, req.body);
  const resultado = await service.login(codigo, password);
  res.status(200).json(resultado);
}

export async function registro(req: Request, res: Response) {
  const datos = validar(registroSchema, req.body);
  const usuario = await service.registro(datos);
  res.status(201).json(usuario);
}
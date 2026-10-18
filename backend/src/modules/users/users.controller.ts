import type { Request, Response } from "express";
import {
  crearUsuarioSchema,
  actualizarPerfilSchema,
  estadoSchema,
  rolSchema,
  validar,
  validarId,
} from "./users.schema";
import * as service from "./users.service";

// req.user lo deja validarToken; se usa "!" porque la ruta ya está protegida
const yo = (req: Request) => req.user!;
const idParam = (req: Request) => validarId(String(req.params.id));

export async function me(req: Request, res: Response) {
  res.json(await service.obtenerPerfil(yo(req).id));
}

export async function listar(_req: Request, res: Response) {
  res.json(await service.listar());
}

export async function obtener(req: Request, res: Response) {
  res.json(await service.obtenerPerfil(idParam(req)));
}

export async function crear(req: Request, res: Response) {
  const datos = validar(crearUsuarioSchema, req.body);
  res.status(201).json(await service.crear(yo(req).id, datos));
}

export async function actualizarMe(req: Request, res: Response) {
  const datos = validar(actualizarPerfilSchema, req.body);
  res.json(await service.actualizarPerfil(yo(req).id, datos));
}

export async function cambiarEstado(req: Request, res: Response) {
  const { estado } = validar(estadoSchema, req.body);
  res.json(await service.cambiarEstado(yo(req).id, idParam(req), estado));
}

export async function cambiarRol(req: Request, res: Response) {
  const { rol } = validar(rolSchema, req.body);
  res.json(await service.cambiarRol(yo(req).id, idParam(req), rol));
}

export async function bajaMe(req: Request, res: Response) {
  res.json(await service.bajaLogica(yo(req).id));
}

export async function eliminar(req: Request, res: Response) {
  res.json(await service.eliminar(yo(req).id, idParam(req)));
}
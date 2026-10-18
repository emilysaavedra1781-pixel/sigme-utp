import type { Request, Response } from "express";
import { crearVehiculoSchema, actualizarVehiculoSchema, validar, validarId } from "./vehicles.schema";
import * as service from "./vehicles.service";

// req.user lo deja validarToken; se usa "!" porque la ruta ya está protegida
const yo = (req: Request) => req.user!;
const idParam = (req: Request) => validarId(String(req.params.id));

export async function crear(req: Request, res: Response) {
  const datos = validar(crearVehiculoSchema, req.body);
  res.status(201).json(await service.crear(yo(req).id, datos));
}

export async function listar(req: Request, res: Response) {
  res.json(await service.listarPropios(yo(req).id));
}

export async function obtener(req: Request, res: Response) {
  res.json(await service.obtener(yo(req).id, idParam(req)));
}

export async function actualizar(req: Request, res: Response) {
  const datos = validar(actualizarVehiculoSchema, req.body);
  res.json(await service.actualizar(yo(req).id, idParam(req), datos));
}

export async function eliminar(req: Request, res: Response) {
  res.json(await service.eliminar(yo(req).id, idParam(req)));
}

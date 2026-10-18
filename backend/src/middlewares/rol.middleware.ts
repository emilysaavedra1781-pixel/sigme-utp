import type { Request, Response, NextFunction } from "express";
import { forbidden, unauthorized } from "../shared/errors";
import type { Rol } from "../shared/types";

export function permitirRoles(...roles: Rol[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw unauthorized();
    if (!roles.includes(req.user.rol)) throw forbidden();
    next();
  };
}
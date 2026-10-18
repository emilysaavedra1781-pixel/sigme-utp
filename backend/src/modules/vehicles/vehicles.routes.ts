import { Router } from "express";
import * as c from "./vehicles.controller";

export const vehiclesRoutes = Router();

// Todas las rutas quedan protegidas por validarToken en app.ts
vehiclesRoutes.post("/", c.crear);
vehiclesRoutes.get("/", c.listar);
vehiclesRoutes.get("/:id", c.obtener);
vehiclesRoutes.put("/:id", c.actualizar);
vehiclesRoutes.delete("/:id", c.eliminar);

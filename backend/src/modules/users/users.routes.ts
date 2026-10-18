import { Router } from "express";
import { permitirRoles } from "../../middlewares/rol.middleware";
import * as c from "./users.controller";

export const usersRoutes = Router();

// Rutas propias (cualquier usuario logueado) - ANTES de /:id
usersRoutes.get("/me", c.me);
usersRoutes.put("/me", c.actualizarMe);
usersRoutes.delete("/me", c.bajaMe);

// Rutas de administrador
usersRoutes.get("/", permitirRoles("administrador"), c.listar);
usersRoutes.post("/", permitirRoles("administrador"), c.crear);
usersRoutes.get("/:id", permitirRoles("administrador"), c.obtener);
usersRoutes.patch("/:id/estado", permitirRoles("administrador"), c.cambiarEstado);
usersRoutes.patch("/:id/rol", permitirRoles("administrador"), c.cambiarRol);
usersRoutes.delete("/:id", permitirRoles("administrador"), c.eliminar);
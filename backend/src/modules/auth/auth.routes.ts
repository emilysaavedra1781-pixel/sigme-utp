import { Router } from "express";
import { loginLimiter } from "../../middlewares/rate-limit.middleware";
import * as controller from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/login", loginLimiter, controller.login);
authRoutes.post("/registro", controller.registro);
import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { traceMiddleware } from "./middlewares/trace.middleware";
import { httpLogger } from "./middlewares/http-logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { authRoutes } from "./modules/auth/auth.routes";
import { validarToken } from "./middlewares/auth.middleware";
import { usersRoutes } from "./modules/users/users.routes";
export const app = express();

app.use(traceMiddleware);
app.use(httpLogger);
app.use(
  cors({
    origin: env.CORS_ORIGINS ? env.CORS_ORIGINS.split(",") : true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.send("ok");
});

app.use("/auth", authRoutes);
app.use("/users", validarToken, usersRoutes); 

// Siempre al final
app.use(errorMiddleware);
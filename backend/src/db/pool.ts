import { Pool } from "pg";
import { env } from "../config/env";
import { logger } from "../config/logger";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
});

pool.on("connect", () => {
  logger.debug({ event: "db.client.connected" }, "Nueva conexión de cliente establecida con PostgreSQL");
});

pool.on("error", (err) => {
  logger.error({ event: "db.pool.error", err }, "Error inesperado en el pool de PostgreSQL");
});

pool
  .query("SELECT 1")
  .then(() => logger.info({ event: "db.connected" }, "Conexión a PostgreSQL verificada correctamente"))
  .catch((err) => {
    logger.fatal({ event: "db.connection.failed", err }, "No se pudo conectar a PostgreSQL al arrancar");
    process.exit(1); // Docker lo reinicia con restart: unless-stopped
  });
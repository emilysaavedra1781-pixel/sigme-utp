import { env } from "./config/env";
import { logger } from "./config/logger";
import { app } from "./app";

// "0.0.0.0" permite que tu celular se conecte desde la misma red Wi-Fi
app.listen(env.PORT, "0.0.0.0", () => {
  logger.info({ event: "server.started", port: env.PORT }, `Servidor en http://localhost:${env.PORT}`);
});
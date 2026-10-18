import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100,               // alto para no estorbar en las pruebas de Postman
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos, intenta más tarde" },
});
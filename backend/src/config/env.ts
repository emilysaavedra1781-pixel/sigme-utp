import "dotenv/config";

function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    console.error(`Falta la variable de entorno obligatoria: ${nombre}`);
    process.exit(1);
  }
  return valor;
}

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: requerida("DATABASE_URL"),
  JWT_SECRET: requerida("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  CORS_ORIGINS: process.env.CORS_ORIGINS || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};
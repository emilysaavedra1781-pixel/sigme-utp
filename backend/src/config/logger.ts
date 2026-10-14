// IMPORTANTE: carga el .env antes de leer process.env
import 'dotenv/config';
import pino from 'pino';
import { getTraceId } from './trace-context';

const isProduction = process.env.NODE_ENV !== 'development';

export const logger = pino({
  // Nivel mínimo: debug < info < warn < error < fatal
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),

  // Datos que aparecen en TODOS los logs
  base: {
    service: process.env.SERVICE_NAME || 'auth-service',
    env: process.env.NODE_ENV || 'development',
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  // Agrega el traceId automáticamente si hay uno en el contexto
  mixin() {
    const traceId = getTraceId();
    return traceId ? { traceId } : {};
  },

  // Nunca registrar datos sensibles
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      '*.password',
      'contrasena_hash',
      '*.contrasena_hash',
      'token',
      '*.token',
    ],
    censor: '[REDACTED]',
  },

  // Desarrollo: formato bonito con colores. Producción: JSON plano.
  ...(isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }),
});

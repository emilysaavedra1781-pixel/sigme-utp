import { pinoHttp } from 'pino-http';
import { logger } from '../config/logger';
import { TRACE_HEADER } from '../config/trace-context';

export const httpLogger = pinoHttp({
  logger,

  // Usa el trace ID como ID de la petición
  genReqId: (req) => String(req.headers[TRACE_HEADER]),

  // Agrega el traceId explícitamente a cada log HTTP
  customProps: (req) => ({
    traceId: req.headers[TRACE_HEADER],
    event: 'http.request',
  }),

  // Nivel según el resultado: 5xx = error, 4xx = warn, resto = info
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  // Registra solo lo necesario (sin headers sensibles)
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});

import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { traceStore, TRACE_HEADER } from '../config/trace-context';

export function traceMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header(TRACE_HEADER);

  // Reutiliza el ID entrante (con límite de largo por seguridad) o crea uno nuevo
  const traceId = incoming && incoming.length <= 100 ? incoming : randomUUID();

  // Guardarlo en el request para que otros middlewares lo lean
  req.headers[TRACE_HEADER] = traceId;

  // Devolverlo en la respuesta para poder rastrear desde el cliente
  res.setHeader(TRACE_HEADER, traceId);

  // Todo lo que se ejecute dentro de next() tendrá acceso al traceId
  traceStore.run({ traceId }, () => next());
}

import { AsyncLocalStorage } from 'node:async_hooks';

type TraceStore = { traceId: string };

export const traceStore = new AsyncLocalStorage<TraceStore>();

export const TRACE_HEADER = 'x-trace-id';

export function getTraceId(): string | undefined {
  return traceStore.getStore()?.traceId;
}

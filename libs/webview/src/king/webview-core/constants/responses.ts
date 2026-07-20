import type { ResponderData } from '../types';
import { isObject } from '../utils';

export function ok(data?: unknown, message?: string) {
  return {
    ...(isObject(data) ? (data as object) : {}),
    message: message ?? 'ok',
    status: 200,
  } satisfies ResponderData;
}

export function notOk(message?: string) {
  return {
    message: message ?? 'not ok',
    status: 500,
  } satisfies ResponderData;
}
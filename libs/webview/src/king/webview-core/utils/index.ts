import type { Payload } from '../types';
import type { CallbackEntry, PromiseEntry, EntryType } from '../message-bus/callback-handler';

export function isAndroidMessageBus(bus: unknown): bus is NonNullable<Window['_messageBus']> {
  return typeof bus === 'object' && bus !== null && typeof (bus as Record<string, unknown>).postMessage === 'function';
}

export function parsePayload(payload: string | null): Payload {
  if (payload === null) return null;
  try {
    return JSON.parse(payload) as Payload;
  } catch {
    return payload;
  }
}

export function serializePayload(payload: Payload | undefined): string | null {
  if (payload === null || payload === undefined) return null;
  if (typeof payload === 'string') return payload;
  return JSON.stringify(payload);
}

export function createIsCallbackMessage<T extends string>(callbackMessages: T[]) {
  const set = new Set<string>(callbackMessages);
  return (message: string): boolean => set.has(message);
}

export function isCallback(entry: EntryType): entry is CallbackEntry {
  return 'callback' in entry;
}

export function isPromise(entry: EntryType): entry is PromiseEntry {
  return 'resolve' in entry && 'reject' in entry;
}

export function getPayloadError(payload: string | null): string {
  if (payload === null) return 'Unknown error';
  return payload;
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

export * from './messages';
export * from './errors';
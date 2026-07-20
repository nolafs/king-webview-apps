import { MessageResult } from '../enums';
import { isCallback, isPromise, getPayloadError, parsePayload } from '../utils';
import type { Payload } from '../types';

export interface CallbackData {
  message: string;
  result: MessageResult;
  payload: Payload;
}

export interface OnMessageResponseData {
  id: number;
  message: string;
  result: MessageResult;
  payload: string | null;
}

interface CreatePromiseResult {
  id: number;
  promise: Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

interface Entry {
  timestamp: number;
}

export interface PromiseEntry extends Entry {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export interface CallbackEntry extends Entry {
  callback(data: CallbackData): void;
}

export type EntryType = PromiseEntry | CallbackEntry;

export interface CallbackHandler {
  createPromise(supportsCallback: boolean): CreatePromiseResult;
  handleResponse(data: OnMessageResponseData): void;
  registerCallback(supportsCallback: boolean, callback?: (data: CallbackData) => void): number;
}

function createCallbackHandler() {
  const ids = new Set<number>();
  const callbacks = new Map<number, EntryType>();
  let nextId = 0;

  function getId(): number {
    if (ids.size > 0) {
      const id = ids.values().next().value as number;
      ids.delete(id);
      return id;
    }
    return nextId++;
  }

  function createControlledPromise() {
    let resolve!: (value: unknown) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }

  function handleEntry(entry: EntryType, data: OnMessageResponseData) {
    const { message, result, payload } = data;
    if (isCallback(entry)) {
      entry.callback({ message, result, payload: parsePayload(payload) });
      return;
    }
    if (isPromise(entry)) {
      result === MessageResult.Success
        ? entry.resolve(parsePayload(payload))
        : entry.reject(new Error(getPayloadError(payload)));
    }
  }

  const callbackHandler: CallbackHandler = {
    createPromise(supportsCallback) {
      let id = -1;
      const { promise, reject, resolve } = createControlledPromise();
      if (supportsCallback) {
        id = getId();
        callbacks.set(id, { reject, resolve, timestamp: performance.now() });
      }
      return { id, promise, resolve, reject };
    },

    handleResponse(data) {
      const { id } = data;
      const entry = callbacks.get(id);
      if (typeof entry === 'undefined') return;
      try {
        handleEntry(entry, data);
      } finally {
        callbacks.delete(id);
        ids.add(id);
      }
    },

    registerCallback(supportsCallback, callback) {
      let id = -1;
      if (supportsCallback && typeof callback === 'function') {
        id = getId();
        callbacks.set(id, { callback, timestamp: performance.now() });
      }
      return id;
    },
  };

  return callbackHandler;
}

export default createCallbackHandler();
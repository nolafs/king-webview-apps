import type { HookFunction, Payload, HookResponder } from '../types';
import { MessageResult } from '../enums';
import { notOk, ok } from '../constants/responses';
import { getErrorMessage } from '../utils/errors';

export interface HookHandler {
  invokeHook(message: string, payload: Payload, responder: HookResponder | null): void;
  setHook(message: string, hook: HookFunction): void;
}

function createHookHandler() {
  const hooks = new Map<string, HookFunction>();

  const hookHandler: HookHandler = {
    invokeHook(message, payload, responder) {
      try {
        const hook = hooks.get(message);
        if (hook === undefined) throw new Error(`No hook set for message "${message}"`);
        const data = hook(payload);
        responder?.respond(MessageResult.Success, ok(data));
      } catch (error) {
        responder?.respond(MessageResult.Error, notOk(getErrorMessage(error)));
      }
    },

    setHook(message, hook) {
      hooks.set(message, hook);
    },
  };

  return hookHandler;
}

export default createHookHandler();
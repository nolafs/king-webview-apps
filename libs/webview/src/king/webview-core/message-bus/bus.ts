import { getMessageResult, isExpectingResponse } from '../utils/messages';
import { isAndroidMessageBus, parsePayload, serializePayload } from '../utils';
import type { HookResponder } from '../types';
import { MessageResult } from '../enums';
import hookHandler from './hook-handler';
import callbackHandler from './callback-handler';

export interface MessageBus {
  onMessageReceived(message: string, payload: string, id: number): void;
  onMessageResponse(id: number, message: string, result: MessageResult, payload: string | null): void;
  postMessage(message: string, payload: string | null, id: number): void;
  sendMessageResponse(id: number, result: MessageResult, payload: string | null): void;
}

function createMessageBus(): MessageBus {
  function createResponder(id: number): HookResponder {
    let responseSent = false;
    return {
      respond(result, data) {
        if (responseSent) return;
        responseSent = true;
        messageBus.sendMessageResponse(id, getMessageResult(result), serializePayload(data));
      },
    };
  }

  const messageBus = {
    onMessageReceived(message, payload, id) {
      let responder: HookResponder | null = null;
      if (isExpectingResponse(id)) responder = createResponder(id);
      hookHandler.invokeHook(message, parsePayload(payload), responder);
    },

    onMessageResponse(id, message, result, payload) {
      callbackHandler.handleResponse({ id, message, result: getMessageResult(result), payload });
    },

    postMessage(message, payload, id) {
      this.onMessageResponse(id, message, MessageResult.Success, payload);
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    sendMessageResponse(_id: number, _result: MessageResult, _payload: string | null) {},
  } satisfies MessageBus;

  if (typeof window === 'undefined') return messageBus;

  if (isAndroidMessageBus(window._messageBus)) {
    const postMessage = window._messageBus.postMessage!.bind(window._messageBus);
    const sendMessageResponse = window._messageBus.sendMessageResponse!.bind(window._messageBus);
    messageBus.postMessage = postMessage as (message: string, payload: string | null, id: number) => void;
    messageBus.sendMessageResponse = sendMessageResponse as (id: number, result: MessageResult, payload: string | null) => void;

    window._messageBus.onMessageReceived = (...args) => messageBus.onMessageReceived(...args);
    window._messageBus.onMessageResponse = (...args) => messageBus.onMessageResponse(...args);
    return messageBus;
  }

  const iOSBus = window.webkit?.messageHandlers?._messageBus;
  if (iOSBus) {
    messageBus.postMessage = function (message, payload, id) {
      iOSBus.postMessage(JSON.stringify({ name: message, payload, id }));
    };
    messageBus.sendMessageResponse = function (id, result, payload) {
      iOSBus.postMessage(JSON.stringify({ id, result, payload }));
    };
    window._messageBus = {
      onMessageReceived: (...args) => messageBus.onMessageReceived(...args),
      onMessageResponse: (...args) => messageBus.onMessageResponse(...args),
    };
    return messageBus;
  }

  return messageBus;
}

export default createMessageBus();
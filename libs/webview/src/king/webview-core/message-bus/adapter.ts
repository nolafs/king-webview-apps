import type { HookFunction, Payload } from '../types';
import { createIsCallbackMessage, serializePayload } from '../utils';
import messageBus from './bus';
import callbackHandler from './callback-handler';
import type { CallbackData } from './callback-handler';
import hookHandler from './hook-handler';

export interface PostMessageData<TSenderMessage extends string> {
  message: TSenderMessage;
  payload?: Payload;
  callback?: (data: CallbackData) => void;
}

export interface PostMessageAsyncData<TSenderMessage extends string> {
  message: TSenderMessage;
  payload?: Payload;
}

export interface MessageBusAdapter<TSenderMessage extends string, TReceiverMessage extends string> {
  postMessage(data: PostMessageData<TSenderMessage>): void;
  postMessageAsync(data: PostMessageAsyncData<TSenderMessage>): Promise<unknown>;
  setMessageHook(message: TReceiverMessage, hook: HookFunction): void;
}

export interface MessageBusOptions<
  TSenderMessages extends readonly string[],
  TReceiverMessages extends readonly string[],
> {
  receiverMessages: TReceiverMessages;
  senderMessages: TSenderMessages;
  callbackMessages?: TSenderMessages[number][];
}

export function createMessageBusAdapter<
  TReceiverMessages extends readonly string[],
  TSenderMessages extends readonly string[],
>(options: MessageBusOptions<TReceiverMessages, TSenderMessages>) {
  const { callbackMessages = [] } = options;

  type TReceiverMessageType = TReceiverMessages[number];
  type TSenderMessageType = TSenderMessages[number];

  const isCallbackMessage = createIsCallbackMessage(callbackMessages as string[]);

  const messageBusAdapter = {
    postMessage(data: PostMessageData<TSenderMessageType>) {
      const { message, payload, callback } = data;
      const id = callbackHandler.registerCallback(isCallbackMessage(message), callback);
      messageBus.postMessage(message, serializePayload(payload), id);
    },

    async postMessageAsync(data: PostMessageAsyncData<TSenderMessageType>, timeout = 10_000) {
      const { message, payload } = data;
      const { id, promise, resolve } = callbackHandler.createPromise(isCallbackMessage(message));
      messageBus.postMessage(message, serializePayload(payload), id);
      if (id === -1) resolve(void 0);

      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`postMessageAsync timed out after ${timeout}ms`)), timeout);
      });
      try {
        return await Promise.race([promise, timeoutPromise]);
      } finally {
        clearTimeout(timer);
      }
    },

    setMessageHook(message: TReceiverMessageType, hook: HookFunction) {
      hookHandler.setHook(message, hook);
    },
  } satisfies MessageBusAdapter<TSenderMessageType, TReceiverMessageType>;

  return messageBusAdapter;
}
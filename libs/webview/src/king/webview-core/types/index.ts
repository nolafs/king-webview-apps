import type { MessageResult } from '../enums';

export type Payload = string | object | null;

export type HookFunction = (payload: Payload) => unknown;

export interface ResponderData {
  message: string;
  status: number;
}

export interface HookResponder {
  respond(result: MessageResult, data: ResponderData): void;
}

declare global {
  interface Window {
    _messageBus?: {
      postMessage?: (message: string, payload: string | null, id: number) => void;
      sendMessageResponse?: (id: number, result: number, payload: string | null) => void;
      onMessageReceived?: (message: string, payload: string, id: number) => void;
      onMessageResponse?: (id: number, message: string, result: number, payload: string | null) => void;
    };
    webkit?: {
      messageHandlers?: {
        _messageBus?: {
          postMessage: (data: string) => void;
        };
      };
    };
  }
}
import { MessageResult } from '../enums';

export function getMessageResult(result: MessageResult | number): MessageResult {
  return result === 1 ? MessageResult.Success : MessageResult.Error;
}

export function isExpectingResponse(id: number): boolean {
  return id !== -1;
}

export function defineMessages<T extends string>(...messages: T[]): T[] {
  return messages;
}
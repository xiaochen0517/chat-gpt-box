import {ChatInfo, ChatOptions} from "@/types/chat/ChatInfo.ts";

export interface BaseRequest {

  chatInfo: ChatInfo;

  chatConfig: ChatOptions;

  tabIndex: number;

  refreshCallbackFunc: () => void;

  stopFlag: boolean;

  sendMessage(message: string): Promise<string>;

  cancel(): void;

}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    console.error(error.message);
    return error.message;
  }
  console.error(error);
  return String(error);
}
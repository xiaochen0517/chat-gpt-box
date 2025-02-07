import {BaseRequest} from "@/service/request/BaseRequest.ts";

export type ChatTabInfo = {
  name: string;
  generating: boolean;
  request: BaseRequest | null;
  chat: ChatTabMessage[];
}

export type ChatTabMessage = ChatMessage & {
  reasoningContent?: string;
}

export type ChatMessage = {
  role: ChatMessageRole;
  content: string;
}

export enum ChatMessageRole {
  Developer = "developer",
  System = "system",
  User = "user",
  Assistant = "assistant",
}
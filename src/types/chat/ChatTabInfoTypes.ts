import {BaseRequest} from "@/service/request/BaseRequest.ts";

export type ChatTabInfoTypes = {
  name: string;
  generating: boolean;
  request: BaseRequest | null;
  chat: ChatMessage[];
}
export type ChatMessage = {
  role: ChatMessageRole;
  content: string;
}

export enum ChatMessageRole {
  System = "system",
  User = "user",
  Assistant = "assistant",
}
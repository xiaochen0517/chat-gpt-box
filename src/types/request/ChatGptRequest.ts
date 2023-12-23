import {ChatMessage} from "@/types/chat/ChatTabInfo.ts";

export type ChatGptRequest = {
  apiUrl: string;
  model: string;
  temperature: number;
  contextMaxMessage: number;
  contextMaxTokens: number;
  responseMaxTokens: number;
}

export type ChatGptRequestBody = {
  messages: ChatMessage[];
  model: string;
  stream: boolean;
  temperature: number;
  max_tokens?: number;
}
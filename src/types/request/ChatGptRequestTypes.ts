import {ChatMessage} from "@/types/chat/ChatTabInfoTypes.ts";

export type ChatGptRequestTypes = {
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
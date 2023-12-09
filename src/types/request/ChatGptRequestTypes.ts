import {ChatMessage} from "@/types/chat/ChatTabInfoTypes.ts";

export type ChatGptRequestTypes = {
  apiUrl: string;
  model: string;
  temperature: number;
  context_max_message: number;
  context_max_tokens: number;
  response_max_tokens: number;
}

export type ChatGptRequestBody = {
  messages: ChatMessage[];
  model: string;
  stream: boolean;
  temperature: number;
  max_tokens?: number;
}
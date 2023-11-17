import {ChatMessage} from "@/types/State.ts";

export interface SendRequest {
  robotIndex: number;
  tabIndex: number;
  content: string;
}

export interface RobotOptions {
  apiUrl: string;
  model: string;
  temperature: number;
  context_max_message: number;
  context_max_tokens: number;
  response_max_tokens: number;
}

export interface RequestBody {
  messages: ChatMessage[];
  model: string;
  stream: boolean;
  temperature: number;
  max_tokens?: number;
}
export type GeminiRequestParams = {
  contents: GeminiMessage[];
  generationConfig: GenerationConfig;
}

export type GeminiMessage = {
  role: "user" | "model";
  parts: GeminiMessagePart[];
}

export type GeminiMessagePart = {
  text: string;
  image?: string;
}

export type GenerationConfig = {
  maxOutputTokens?: number;
  temperature: number;
  topP?: number;
  topK?: number;
}
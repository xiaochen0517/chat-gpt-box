export type DallEChatRequestBody = {
  prompt: string;
  model: string;
  n: number;
  quality?: string;
  size?: string;
  style?: string;
}
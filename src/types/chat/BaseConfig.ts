import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";

export type BaseConfig = {
  enterSend: boolean;
  ctrlEnterSend: boolean;
}
export type DefaultChatConfig = {
  openAi: OpenAiConfig;
  google: GoogleConfig;
}
export type OpenAiConfig = {
  base: OpenAiBaseConfig;
  chatGpt: OpenAiChatGptConfig;
  dallE: OpenAiDallEConfig;
}
export type OpenAiBaseConfig = {
  apiKey: string;
}
export type OpenAiChatGptConfig = {
  apiUrl: string;
  model: string;
  temperature: number;
  contextMaxMessage: number;
  contextMaxTokens: number;
  responseMaxTokens: number;
}
export type OpenAiDallEConfig = {
  apiUrl: string;
  model: string;
  imageCount: number;
  imageSize: string;
  imageStyle?: string;
  imageQuality?: string;
}
export type GoogleConfig = {
  base: GoogleBaseConfig;
  gemini: GoogleGeminiConfig;
}
export type GoogleBaseConfig = {
  apiKey: string;
}
export type GoogleGeminiConfig = {
  apiUrl: string;
  model: string;
  maxOutputTokens: number;
  temperature: number;
  topP?: number;
  topK?: number;
  contextMaxTokens: number;
  contextMaxMessage: number;
}
export type ShortcutConfig = {
  focusInput: KeyMapEnum[];
  openSetting: KeyMapEnum[];
  addTab: KeyMapEnum[];
  removeTab: KeyMapEnum[];
  cleanTabChat: KeyMapEnum[];
  prevTab: KeyMapEnum[];
  nextTab: KeyMapEnum[];
  addRobot: KeyMapEnum[];
  switchRobot: KeyMapEnum[];
  prevRobot: KeyMapEnum[];
  nextRobot: KeyMapEnum[];
}
export type ShortcutConfigKey = keyof ShortcutConfig;
export type ShortcutStringConfig = {
  [key in ShortcutConfigKey]: string;
}
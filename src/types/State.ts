import {RequestUtil} from "@/utils/RequestUtil.ts";

export interface ShortcutState {
  focusInput: string;
  openSetting: string;
  addTab: string;
  removeTab: string;
  cleanTabChat: string;
  prevTab: string;
  nextTab: string;
  addRobot: string;
  switchRobot: string;
  prevRobot: string;
  nextRobot: string;
}

export interface Robot {
  name: string;
  prompt: string;
  options: StoreRobotOptions;
}

export interface StoreRobotOptions {
  enabled: boolean;
  apiUrl: string;
  model: string;
  temperature: number;
  context_max_message: number;
  context_max_tokens: number;
  response_max_tokens: number;
}

export interface RobotTabChatInfo {
  name: string;
  generating: boolean;
  request: RequestUtil | null;
  chat: ChatMessage[];
}

export interface BaseConfig {
  apiKey: string;
  enterSend: boolean;
  ctrlEnterSend: boolean;
  apiUrl: string;
  model: string;
  temperature: number;
  context_max_message: number;
  context_max_tokens: number;
  response_max_tokens: number;
}

export interface Config {
  isDarkMode: boolean;
  base: BaseConfig;
  shortcut: ShortcutState;
}

export interface State {
  version: string;
  robotList: Robot[];
  chatHistory: RobotTabChatInfo[][];
  config: Config;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant" | null;
  content: string;
}
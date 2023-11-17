import {RequestUtil} from "@/util/RequestUtil.ts";

export interface ShortcutState {
  // 聚焦到输入框
  focusInput: string;
  // 打开设置窗口
  openSetting: string;
  // 添加tab
  addTab: string;
  // 删除tab
  removeTab: string;
  // 清空当前tab页聊天记录
  cleanTabChat: string;
  // 上一个tab页
  prevTab: string;
  // 下一个tab页
  nextTab: string;
  // 新增机器人
  addRobot: string;
  // 切换机器人
  switchRobot: string;
  // 上一个机器人
  prevRobot: string;
  // 下一个机器人
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
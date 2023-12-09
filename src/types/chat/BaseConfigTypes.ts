import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";

export type BaseConfigTypes = {
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
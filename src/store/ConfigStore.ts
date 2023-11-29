import {defineStore} from "pinia";
import {BaseConfig, ConfigStore, ShortcutConfig} from "@/types/Store.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";

export function getBaseShortcut(): ShortcutConfig {
  return {
    focusInput: [KeyMapEnum.CONTROL, KeyMapEnum.BACKSLASH],
    openSetting: [KeyMapEnum.CONTROL, KeyMapEnum.S],
    addTab: [KeyMapEnum.CONTROL, KeyMapEnum.T],
    removeTab: [KeyMapEnum.CONTROL, KeyMapEnum.W],
    cleanTabChat: [KeyMapEnum.CONTROL, KeyMapEnum.E],
    prevTab: [KeyMapEnum.CONTROL, KeyMapEnum.LEFT],
    nextTab: [KeyMapEnum.CONTROL, KeyMapEnum.RIGHT],
    addRobot: [KeyMapEnum.CONTROL, KeyMapEnum.N],
    switchRobot: [KeyMapEnum.CONTROL, KeyMapEnum.TAB],
    prevRobot: [KeyMapEnum.CONTROL, KeyMapEnum.UP],
    nextRobot: [KeyMapEnum.CONTROL, KeyMapEnum.DOWN],
  }
}

export const useConfigStore = defineStore("config", {
  state: (): ConfigStore => {
    return {
      isDarkMode: true,
      baseConfig: {
        apiKey: "",
        enterSend: true,
        ctrlEnterSend: false,
        apiUrl: "https://api.openai.com/",
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        context_max_message: 2,
        context_max_tokens: 2000,
        response_max_tokens: 0,
      },
      shortcut: getBaseShortcut()
    }
  },
  actions: {
    setDarkMode(isDarkMode: boolean) {
      this.isDarkMode = isDarkMode;
    },
    setBaseConfig<K extends keyof BaseConfig>(key: K, value: BaseConfig[K]) {
      this.baseConfig[key] = value;
    },
    setApiKey(apiKey: string) {
      this.baseConfig.apiKey = apiKey;
    },
    setEnterSend(enterSend: boolean) {
      this.baseConfig.enterSend = enterSend;
    },
    setCtrlEnterSend(ctrlEnterSend: boolean) {
      this.baseConfig.ctrlEnterSend = ctrlEnterSend;
    },
    setApiUrl(apiUrl: string) {
      this.baseConfig.apiUrl = apiUrl;
    },
    setModel(model: string) {
      this.baseConfig.model = model;
    },
    setTemperature(temperature: number) {
      this.baseConfig.temperature = temperature;
    },
    setContextMaxMessage(contextMaxMessage: number) {
      this.baseConfig.context_max_message = contextMaxMessage;
    },
    setContextMaxTokens(contextMaxTokens: number) {
      this.baseConfig.context_max_tokens = contextMaxTokens;
    },
    setResponseMaxTokens(responseMaxTokens: number) {
      this.baseConfig.response_max_tokens = responseMaxTokens;
    },
    resetShortcut() {
      this.shortcut = getBaseShortcut();
    },
    setShortcut(config: ShortcutConfig) {
      this.shortcut = config;
    },
    updateShortcutKeyValues(keyName: keyof ShortcutConfig, keyValues: KeyMapEnum[]) {
      if (!keyValues) return false;

      let shortcut = this.shortcut;
      shortcut[keyName] = keyValues;
      this.setShortcut(shortcut);
    },
  },
  persist: {
    key: 'Config',
  },
})
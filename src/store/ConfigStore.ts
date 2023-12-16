import {defineStore} from "pinia";
import {ConfigStore} from "@/types/StoreTypes.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import _ from "lodash";
import {KeyMapUtil} from "@/utils/KeyMapUtil.ts";
import {DEFAULT_SHORTCUT} from "./defaults/DefaultShortcut.ts";
import {BaseConfigTypes, ShortcutConfig, ShortcutConfigKey, ShortcutStringConfig} from "@/types/chat/BaseConfigTypes.ts";

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
        contextMaxMessage: 2,
        contextMaxTokens: 2000,
        responseMaxTokens: 0,
      },
      shortcut: _.cloneDeep(DEFAULT_SHORTCUT),
      shortcutKeyMapMaxSize: 5,
    };
  },
  getters: {
    shortcutStringConfig(state): ShortcutStringConfig {
      return KeyMapUtil.formatShortcutConfig2ShortcutStringConfig(state.shortcut);
    },
  },
  actions: {
    setDarkMode(isDarkMode: boolean) {
      this.isDarkMode = isDarkMode;
    },
    setBaseConfig<K extends keyof BaseConfigTypes>(key: K, value: BaseConfigTypes[K]) {
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
      this.baseConfig.contextMaxMessage = contextMaxMessage;
    },
    setContextMaxTokens(contextMaxTokens: number) {
      this.baseConfig.contextMaxTokens = contextMaxTokens;
    },
    setResponseMaxTokens(responseMaxTokens: number) {
      this.baseConfig.responseMaxTokens = responseMaxTokens;
    },
    resetShortcut() {
      this.shortcut = _.cloneDeep(DEFAULT_SHORTCUT);
    },
    setShortcutConfig(config: ShortcutConfig) {
      this.shortcut = config;
    },
    setShortcut(shortcutConfigKey: ShortcutConfigKey, keyMapList: KeyMapEnum[]) {
      if (!keyMapList) return false;
      const shortcut = _.cloneDeep(this.shortcut);
      shortcut[shortcutConfigKey] = keyMapList;
      this.setShortcutConfig(shortcut);
    },
  },
  persist: {
    key: "Config",
  },
});
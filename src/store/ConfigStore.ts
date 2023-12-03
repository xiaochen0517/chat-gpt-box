import {defineStore} from "pinia";
import {BaseConfig, ConfigStore, ShortcutConfig, ShortcutConfigKey, ShortcutStringConfig} from "@/types/Store.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import _ from "lodash";
import {KeyMapUtil} from "@/utils/KeyMapUtil.ts";
import {DEFAULT_SHORTCUT} from "./defaults/DefaultShortcut.ts";

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
      shortcut: _.cloneDeep(DEFAULT_SHORTCUT),
      shortcutKeyMapMaxSize: 5,
    }
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
      this.shortcut = _.cloneDeep(DEFAULT_SHORTCUT);
    },
    setShortcutConfig(config: ShortcutConfig) {
      this.shortcut = config;
    },
    setShortcut(shortcutConfigKey: ShortcutConfigKey, keyMapList: KeyMapEnum[]) {
      if (!keyMapList) return false;
      let shortcut = _.cloneDeep(this.shortcut);
      shortcut[shortcutConfigKey] = keyMapList;
      this.setShortcutConfig(shortcut);
    },
  },
  persist: {
    key: 'Config',
  },
})
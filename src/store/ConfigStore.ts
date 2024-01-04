import {defineStore} from "pinia";
import {ConfigStore} from "@/types/StoreTypes.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import _ from "lodash";
import {KeyMapUtil} from "@/utils/KeyMapUtil.ts";
import {DEFAULT_SHORTCUT} from "./defaults/DefaultShortcut.ts";
import {BaseConfig, ShortcutConfig, ShortcutConfigKey, ShortcutStringConfig} from "@/types/chat/BaseConfig.ts";

export const useConfigStore = defineStore("config", {
  state: (): ConfigStore => {
    return {
      isDarkMode: true,
      baseConfig: {
        language: "zh-CN",
        enterSend: true,
        ctrlEnterSend: false,
        bubbleMessage: true,
        forceScrollToBottom: false,
        chatTemplateUrl: "https://xiaochen0517.github.io/chat-gpt-box/chat_template.json",
      },
      defaultChatConfig: {
        openAi: {
          base: {
            apiKey: "",
          },
          chatGpt: {
            apiUrl: "https://api.openai.com/",
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            contextMaxMessage: 5,
            contextMaxTokens: 2048,
            responseMaxTokens: 0,
          },
          dallE: {
            apiUrl: "https://api.openai.com/",
            model: "dall-e-3",
            imageCount: 1,
            imageSize: "1024x1024",
            imageStyle: "vivid",
            imageQuality: "standard",
          }
        },
        google: {
          base: {
            apiKey: "",
          },
          gemini: {
            apiUrl: "https://generativelanguage.googleapis.com/",
            model: "gemini-pro",
            maxOutputTokens: 0,
            temperature: 0.7,
            contextMaxTokens: 2048,
            contextMaxMessage: 5,
          }
        }
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
    setBaseConfig<K extends keyof BaseConfig>(key: K, value: BaseConfig[K]) {
      this.baseConfig[key] = value;
    },
    setEnterSend(enterSend: boolean) {
      this.baseConfig.enterSend = enterSend;
    },
    setCtrlEnterSend(ctrlEnterSend: boolean) {
      this.baseConfig.ctrlEnterSend = ctrlEnterSend;
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
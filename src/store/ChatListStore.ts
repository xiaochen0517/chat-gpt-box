import {defineStore} from "pinia";
import {ChatListStore} from "@/types/StoreTypes.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {v4 as uuidv4} from "uuid";
import _ from "lodash";
import {ChatInfo, ChatOptions, ChatType} from "@/types/chat/ChatInfo.ts";
import {
  GoogleGeminiConfig,
  OllamaDefaultConfig,
  OpenAiChatGptConfig,
  OpenAiDallEConfig,
} from "@/types/chat/BaseConfig.ts";

export const useChatListStore = defineStore("chatList", {
  state: (): ChatListStore => {
    return {
      chatList: [
        {
          id: "default",
          name: "Assistant",
          avatar: {
            isCircle: false,
            skinColor: "#ffe0bd",
            hairColor: "#000000",
            topColor: "#000000",
            facialHairColor: "#000000",
            clothesColor: "#000000",
            clothes: "Hoodie",
            top: "LongHairStraight",
            accessories: "Blank",
            facialHair: "Blank",
            eyes: "Happy",
            eyebrows: "Default",
            mouth: "Smile",
          },
          prompt: "You are a helpful assistant.",
          chatType: ChatType.CHAT_GPT,
          options: {
            apiUrl: "https://api.openai.com/",
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            contextMaxMessage: 5,
            contextMaxTokens: 2048,
            responseMaxTokens: 0,
          },
        },
      ],
    };
  },
  actions: {
    setChatList(chatList: ChatInfo[]) {
      this.chatList = chatList;
    },
    getChatInfo(id: string): ChatInfo | null {
      return _.cloneDeep(this.chatList.find((chat: ChatInfo): boolean => chat.id === id) ?? null);
    },
    setChatInfo<K extends keyof ChatInfo>(id: string, key: K, value: ChatInfo[K]) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      const chatInfo = this.chatList[index];
      chatInfo[key] = value;
      // If you are modifying the prompt, you need to update the prompt in the chatTabsStore
      const promptKey = "prompt" as keyof ChatInfo;
      if (key === promptKey && chatInfo.chatType === ChatType.CHAT_GPT) {
        useChatTabsStore().setAllTabPromptMessage(id, value as string);
      }
    },
    setGPTChatOptions<K extends keyof OpenAiChatGptConfig>(id: string, key: K, value: OpenAiChatGptConfig[K]) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      const chatInfo = this.chatList[index];
      // if current chat type is not GPT, return
      if (chatInfo.chatType !== ChatType.CHAT_GPT) return;
      (chatInfo.options as OpenAiChatGptConfig)[key] = value;
    },
    setAllGPTChatOptions<K extends keyof OpenAiChatGptConfig>(key: K, value: OpenAiChatGptConfig[K]) {
      for (const chatInfo of this.chatList) {
        if (chatInfo.chatType !== ChatType.CHAT_GPT) continue;
        (chatInfo.options as OpenAiChatGptConfig)[key] = value;
      }
    },
    setDallEChatOptions<K extends keyof OpenAiDallEConfig>(id: string, key: K, value: OpenAiDallEConfig[K]) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      const chatInfo = this.chatList[index];
      if (chatInfo.chatType !== ChatType.DALL_E) return;
      (chatInfo.options as OpenAiDallEConfig)[key] = value;
    },
    setAllDallEChatOptions<K extends keyof OpenAiDallEConfig>(key: K, value: OpenAiDallEConfig[K]) {
      for (const chatInfo of this.chatList) {
        if (chatInfo.chatType !== ChatType.DALL_E) continue;
        (chatInfo.options as OpenAiDallEConfig)[key] = value;
      }
    },
    setGeminiChatOptions<K extends keyof GoogleGeminiConfig>(id: string, key: K, value: GoogleGeminiConfig[K]) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      const chatInfo = this.chatList[index];
      if (chatInfo.chatType !== ChatType.GEMINI) return;
      (chatInfo.options as GoogleGeminiConfig)[key] = value;
    },
    setAllGeminiChatOptions<K extends keyof GoogleGeminiConfig>(key: K, value: GoogleGeminiConfig[K]) {
      for (const chatInfo of this.chatList) {
        if (chatInfo.chatType !== ChatType.GEMINI) continue;
        (chatInfo.options as GoogleGeminiConfig)[key] = value;
      }
    },
    setOllamaChatOptions<K extends keyof OllamaDefaultConfig>(id: string, key: K, value: OllamaDefaultConfig[K]) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      const chatInfo = this.chatList[index];
      if (chatInfo.chatType !== ChatType.OLLAMA) return;
      (chatInfo.options as OllamaDefaultConfig)[key] = value;
    },
    setAllOllamaChatOptions<K extends keyof OllamaDefaultConfig>(key: K, value: OllamaDefaultConfig[K]) {
      for (const chatInfo of this.chatList) {
        if (chatInfo.chatType !== ChatType.OLLAMA) continue;
        (chatInfo.options as OllamaDefaultConfig)[key] = value;
      }
    },
    setChatOptions<K extends keyof ChatOptions>(id: string, key: K, value: ChatOptions[K]) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      this.chatList[index].options[key] = value;
    },
    addChat(chatInfo: ChatInfo) {
      chatInfo.id = uuidv4();
      this.chatList.push(chatInfo);
      useChatTabsStore().addDefaultChatTab(chatInfo.id);
    },
    deleteChat(id: string) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      this.chatList.splice(index, 1);
      useChatTabsStore().removeChatTabs(id);
    },
    getChatInfoIndex(chatInfo: ChatInfo | string): number {
      const chatInfoId: string = typeof chatInfo !== "string" ? chatInfo.id : chatInfo;
      return this.chatList.findIndex((chat: ChatInfo): boolean => chat.id === chatInfoId);
    },
    getPrevChatInfo(chatInfo: ChatInfo): ChatInfo | null {
      const index = this.getChatInfoIndex(chatInfo);
      if (index <= 0) return null;
      return this.chatList[index - 1];
    },
    getNextChatInfo(chatInfo: ChatInfo): ChatInfo | null {
      const index = this.getChatInfoIndex(chatInfo);
      if (index < 0 || index >= this.chatList.length - 1) return null;
      return this.chatList[index + 1];
    },
    getSwitchChatInfo(chatInfo: ChatInfo): ChatInfo {
      const index = this.getChatInfoIndex(chatInfo);
      if (index < 0 || index >= this.chatList.length - 1) return this.chatList[0];
      return this.chatList[index + 1];
    },
  },
  persist: {
    key: "ChatList",
  },
});

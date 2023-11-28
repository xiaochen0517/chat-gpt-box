import {defineStore} from "pinia";
import {ChatInfo, ChatListStore, ChatOptions, ChatType} from "@/types/Store.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {v4 as uuidv4} from "uuid";
import _ from "lodash";

export const useChatListStore = defineStore("chatList", {
  state: (): ChatListStore => {
    return {
      chatList: [
        {
          id: "default",
          name: "Default Chat",
          prompt: "You are a helpful assistant.",
          chatType: ChatType.CHAT_GPT,
          options: {
            enabled: false,
            apiUrl: "https://api.openai.com/",
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            context_max_message: 1,
            context_max_tokens: 2048,
            response_max_tokens: 0
          },
        },
        {
          id: "default1",
          name: "Default Chat GPT-4",
          prompt: "You are a helpful assistant. Please ask me anything.",
          chatType: ChatType.CHAT_GPT,
          options: {
            enabled: true,
            apiUrl: "https://api.openai.com/",
            model: "gpt-4-1106-preview",
            temperature: 0.7,
            context_max_message: 1,
            context_max_tokens: 2048,
            response_max_tokens: 0
          },
        },
      ]
    }
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
      this.chatList[index][key] = value;
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
      let chatInfoId: string = typeof chatInfo !== "string" ? chatInfo.id : chatInfo;
      return this.chatList.findIndex((chat: ChatInfo): boolean => chat.id === chatInfoId);
    },
    removeChat(id: string) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      this.chatList.splice(index, 1);
    },
    updateChat(id: string, newChatInfo: ChatInfo) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      this.chatList[index] = newChatInfo;
    },
    setChatName(id: string, name: string) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      this.chatList[index].name = name;
    },
    moveChat(direction: "up" | "down", id: string, size: number) {
      const index = this.getChatInfoIndex(id);
      if (index < 0) return;
      const chat = this.chatList[index];
      this.chatList.splice(index, 1);
      switch (direction) {
        case "up":
          this.chatList.splice(index - size, 0, chat);
          break;
        case "down":
          this.chatList.splice(index + size, 0, chat);
          break;
      }
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
    key: 'ChatList',
  },
})
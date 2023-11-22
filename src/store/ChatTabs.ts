import {defineStore} from "pinia";
import {ChatTabsStore} from "@/types/Store.ts";
import {useChatListStore} from "@/store/ChatList.ts";

const chatListStore = useChatListStore();
export const useChatTabsStore = defineStore("chatTabs", {
  state: (): ChatTabsStore => {
    return {
      chatTabs: {
        default: [
          {
            name: "default",
            generating: false,
            request: null,
            chat: [{role: "system", content: "You are a helpful assistant."}],
          },
        ],
      }
    }
  },
  actions: {
    addDefaultChatTab(id: string) {
      if (!id) return;
      let chatInfo = chatListStore.getChatInfo(id);
      if (!chatInfo) return;
      this.chatTabs[id].push({
        name: "default",
        generating: false,
        request: null,
        chat: [{role: "system", content: chatInfo.prompt}],
      });
    },
    cleanTabChat(id: string, tabIndex: number) {
      if (!id || !this.chatTabs[id]) return;
      let chatInfo = chatListStore.getChatInfo(id);
      if (!chatInfo) return;
      this.chatTabs[id][tabIndex].chat = [{role: "system", content: chatInfo.prompt}];
    },
    removeChatTab(id: string, tabIndex: number) {
      if (!id || !this.chatTabs[id]) return;
      this.chatTabs[id].splice(tabIndex, 1);
      if (this.chatTabs[id].length === 0) {
        this.addDefaultChatTab(id);
      }
    },
    removeChatMessage(id: string, tabIndex: number, messageIndex: number) {
      if (!id || !this.chatTabs[id] || tabIndex < 0 || messageIndex < 0) return;
      this.chatTabs[id][tabIndex].chat.splice(messageIndex, 1);
    }
  },
  persist: {
    key: 'ChatTabs',
  },
})
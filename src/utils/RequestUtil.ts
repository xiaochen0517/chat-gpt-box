import {useChatListStore} from "@/store/ChatListStore.ts";
import {ChatGptRequest} from "@/service/request/ChatGptRequest.ts";
import {DallERequest} from "@/service/request/DallERequest.ts";
import {ChatInfo, ChatType} from "@/types/chat/ChatInfo.ts";
import {GeminiRequest} from "@/service/request/GeminiRequest.ts";

const chatListStore = useChatListStore();
export const createRequest = (chatInfo: ChatInfo, tabIndex: number, refreshCallbackFunc: () => void | null) => {
  switch (chatInfo.chatType) {
    case ChatType.CHAT_GPT:
      return new ChatGptRequest(chatInfo, tabIndex, refreshCallbackFunc);
    case ChatType.DALL_E:
      return new DallERequest(chatInfo, tabIndex, refreshCallbackFunc);
    case ChatType.GEMINI:
      return new GeminiRequest(chatInfo, tabIndex, refreshCallbackFunc);
    default:
      chatListStore.setChatInfo(chatInfo.id, "chatType", ChatType.CHAT_GPT);
      return new ChatGptRequest(chatInfo, tabIndex, refreshCallbackFunc);
  }
};

import {BaseRequest} from "@/service/request/BaseRequest.ts";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {RequestOptions} from "@/types/request/RequestOptions.ts";

class GeminiRequest implements BaseRequest {

  chatInfo: ChatInfo;

  refreshCallbackFunc: () => void;

  requestOptions: RequestOptions | null;

  stopFlag: boolean;

  constructor(chatInfo: ChatInfo) {
    this.chatInfo = chatInfo;
  }

  sendMessage(requestOptions: RequestOptions, refreshCallbackFunc: () => void): Promise<string>;

  cancel(): void;
}
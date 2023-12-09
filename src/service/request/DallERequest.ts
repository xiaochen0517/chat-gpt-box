import {BaseRequest} from "@/service/request/BaseRequest.ts";
import {RequestOptionsTypes} from "@/types/request/RequestOptionsTypes.ts";
import {ChatInfoTypes} from "@/types/chat/ChatInfoTypes.ts";

export class DallERequest implements BaseRequest {

  chatInfo: ChatInfoTypes;

  refreshCallbackFunc: () => void = () => {
  };

  requestOptions: RequestOptionsTypes | null = null;

  stopFlag: boolean = false;

  constructor(chatInfo: ChatInfoTypes) {
    this.chatInfo = chatInfo;
  }

  sendMessage(requestOptions: RequestOptionsTypes, refreshCallbackFunc: () => void): Promise<string> {
    console.log("message: " + requestOptions);
    console.log("refreshFunc: " + refreshCallbackFunc);
    return new Promise<string>((resolve, _reject) => {
      resolve("null");
    });
  }

  cancel(): void {
    this.stopFlag = true;
  }

}
import {BaseRequest} from "@/utils/request/BaseRequest.ts";
import {ChatInfo} from "@/types/Store.ts";
import {RequestOptions} from "@/types/request/RequestOptions.ts";

export class DallERequest implements BaseRequest {

  chatInfo: ChatInfo;

  refreshCallbackFunc: () => void = () => {
  };

  requestOptions: RequestOptions | null = null;

  stopFlag: boolean = false;

  constructor(chatInfo: ChatInfo) {
    this.chatInfo = chatInfo;
  }

  sendMessage(requestOptions: RequestOptions, refreshCallbackFunc: () => void): Promise<string> {
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
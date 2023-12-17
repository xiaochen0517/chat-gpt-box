import {RequestOptions} from "@/types/request/RequestOptions.ts";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";

export interface BaseRequest {

  chatInfo: ChatInfo;

  refreshCallbackFunc: () => void;

  requestOptions: RequestOptions | null;

  stopFlag: boolean;

  sendMessage(requestOptions: RequestOptions, refreshCallbackFunc: () => void): Promise<string>;

  cancel(): void;

}

export const checkParams = (requestOptions: RequestOptions, refreshCallbackFunc: () => void): void => {
  console.log("request options", requestOptions);
  if (!refreshCallbackFunc) throw new Error("refresh callback invalid");
  if (!requestOptions) throw new Error("request options is null");
  if (!(requestOptions.tabIndex >= 0)) throw new Error("tab index invalid");
  if (!requestOptions.message) throw new Error("message invalid");
};
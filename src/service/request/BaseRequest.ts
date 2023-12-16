import {RequestOptionsTypes} from "@/types/request/RequestOptionsTypes.ts";
import {ChatInfoTypes} from "@/types/chat/ChatInfoTypes.ts";

export interface BaseRequest {

  chatInfo: ChatInfoTypes;

  refreshCallbackFunc: () => void;

  requestOptions: RequestOptionsTypes | null;

  stopFlag: boolean;

  sendMessage(requestOptions: RequestOptionsTypes, refreshCallbackFunc: () => void): Promise<string>;

  cancel(): void;

}

export const checkParams = (requestOptions: RequestOptionsTypes, refreshCallbackFunc: () => void): void => {
  console.log("request options", requestOptions);
  if (!refreshCallbackFunc) throw new Error("refresh callback invalid");
  if (!requestOptions) throw new Error("request options is null");
  if (!(requestOptions.tabIndex >= 0)) throw new Error("tab index invalid");
  if (!requestOptions.message) throw new Error("message invalid");
};
import {ChatInfo} from "@/types/Store.ts";
import {RequestOptions} from "@/types/request/RequestOptions.ts";

export interface BaseRequest {

  chatInfo: ChatInfo;

  refreshCallbackFunc: () => void;

  requestOptions: RequestOptions | null;

  stopFlag: boolean;

  sendMessage(requestOptions: RequestOptions, refreshCallbackFunc: () => void): Promise<string>;

  cancel(): void;

}
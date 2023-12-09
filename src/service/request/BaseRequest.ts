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
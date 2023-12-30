import {ChatInfo, ChatOptions} from "@/types/chat/ChatInfo.ts";

export interface BaseRequest {

  chatInfo: ChatInfo;

  chatConfig: ChatOptions;

  tabIndex: number;

  refreshCallbackFunc: () => void;

  stopFlag: boolean;

  sendMessage(message: string): Promise<string>;

  cancel(): void;

}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    console.error(error.message);
    return error.message;
  }
  console.error(error);
  return String(error);
}

export async function checkFetchResponse(data: Response): Promise<string | null> {
  if (!data.ok || data.status !== 200) {
    let errMsg = `request failure status：${data.status}`;
    if (data.body) {
      const dataText = await data.text();
      errMsg += `; message: \n\`\`\`json\n${dataText}\n\`\`\``;
    }
    return errMsg;
  }
  return null;
}
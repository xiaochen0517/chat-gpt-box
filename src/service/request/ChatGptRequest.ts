import {BaseRequest, getErrorMessage} from "@/service/request/BaseRequest.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {ChatGptRequestBody} from "@/types/request/ChatGptRequest.ts";
import {encoding_for_model, Tiktoken, TiktokenModel} from "tiktoken";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {ChatMessage, ChatMessageRole, ChatTabInfo} from "@/types/chat/ChatTabInfo.ts";
import {OpenAiChatGptConfig} from "@/types/chat/BaseConfig.ts";

const CHAT_GPT_API_SUFFIX: string = "v1/chat/completions";
const HTTP_REQ_TYPE: string = "POST";
const decoder: TextDecoder = new TextDecoder("utf-8");
// global store
const configStore = useConfigStore();
const chatTabsStore = useChatTabsStore();

const DATA_DONE_FLAG: string = "[DONE]";

export class ChatGptRequest implements BaseRequest {

  chatInfo: ChatInfo;

  chatConfig: OpenAiChatGptConfig;

  tabIndex: number;

  refreshCallbackFunc: () => void = () => {
  };

  stopFlag: boolean = false;

  abortController: AbortController | null = null;

  reader: ReadableStreamDefaultReader | null = null;

  constructor(chatInfo: ChatInfo, tabIndex: number, refreshCallbackFunc: () => void | null) {
    this.chatInfo = chatInfo;
    this.chatConfig = chatInfo.options as OpenAiChatGptConfig;
    this.tabIndex = tabIndex;
    if (refreshCallbackFunc) this.refreshCallbackFunc = refreshCallbackFunc;
  }

  public sendMessage(message: string): Promise<string> {
    this.abortController = new AbortController();
    this.stopFlag = false;
    this.setGenerating(true);
    try {
      this.pushUserMessage2ChatTab(message);
      this.addAssistantMessage();
      return this.sendFetch();
    } catch (error) {
      const message = getErrorMessage(error);
      this.setErrorMsgContent(message);
      return Promise.reject(error);
    }
  }

  public cancel(): void {
    this.stopFlag = true;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      this.refreshCallbackFunc = () => {
      };
    }
    if (!this.reader) return;
    this.reader.cancel().then(() => {
      console.log("取消读取");
      this.reader = null;
    }).catch((error) => {
      console.error(error);
      this.reader = null;
    });
  }

  private sendFetch(): Promise<string> {
    fetch(
      this.chatConfig.apiUrl + CHAT_GPT_API_SUFFIX,
      this.generateRequest())
      .then(this.handleFetchResponse)
      .catch(this.handleFetchError);
    return Promise.resolve("");
  }

  private handleFetchError(error: Error): void {
    console.error(error);
    this.setErrorMsgContent(error.message);
  }

  private async handleFetchResponse(data: Response): Promise<void> {
    if (!await this.checkFetchResponse(data)) return;
    try {
      if (!data.body) throw new Error("response body is null");
      this.reader = data.body.getReader();
      await this.readResponse(await this.reader.read());
    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : String(error);
      this.setErrorMsgContent(errMsg);
    }
  }

  private async checkFetchResponse(data: Response): Promise<boolean> {
    if (!data.ok || data.status !== 200) {
      let errMsg = `request failure status：${data.status}`;
      if (data.body) {
        const dataText = await data.text();
        errMsg += `; message: \n\`\`\`json\n${dataText}\n\`\`\``;
      }
      this.setErrorMsgContent(errMsg);
      return false;
    }
    return true;
  }

  private generateRequest(): RequestInit {
    return {
      method: HTTP_REQ_TYPE,
      headers: this.generateRequestHeader(),
      body: JSON.stringify(this.generateRequestBody()),
      signal: this.abortController?.signal,
    };
  }

  private generateRequestHeader(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + configStore.defaultChatConfig.openAi.base.apiKey,
    };
  }

  private generateRequestBody(): ChatGptRequestBody {
    return {
      messages: this.getMessage2Send(),
      model: this.chatConfig.model,
      stream: true,
      temperature: this.chatConfig.temperature,
      max_tokens: this.chatConfig.responseMaxTokens > 0 ? this.chatConfig.responseMaxTokens : undefined,
    };
  }

  private getMessage2Send(): ChatMessage[] {
    const chatTabInfo = this.getChatTabInfo(this.tabIndex);
    let messages: ChatMessage[] = this.getMaxContextMessage(chatTabInfo);
    messages = this.filterMessagesWithTokenLimit(messages);
    messages.unshift({role: ChatMessageRole.System, content: this.chatInfo.prompt});
    console.log("send messages: ", messages);
    return messages;
  }

  private getChatTabInfo(tabIndex: number): ChatTabInfo {
    const chatTabInfo = chatTabsStore.getChatTabInfo(this.chatInfo.id, tabIndex);
    if (!chatTabInfo) throw new Error("chat tab info is null");
    return chatTabInfo;
  }

  private getMaxContextMessage(chatTabInfo: ChatTabInfo): ChatMessage[] {
    const tabChatLength = chatTabInfo.chat.length;
    if (tabChatLength === 0) return [];
    const messages: ChatMessage[] = [];
    // contextMaxMessage plus 2, because the last message is user new message
    let maxContextMinCount = tabChatLength - (this.chatConfig.contextMaxMessage + 2);
    if (maxContextMinCount < 0) maxContextMinCount = 0;
    for (let i = tabChatLength - 1; i >= maxContextMinCount; i--) {
      const chatMessage = chatTabInfo.chat[i];
      if (chatMessage.role === "system") continue;
      messages.unshift(chatMessage);
    }
    return messages;
  }

  private filterMessagesWithTokenLimit(messages: ChatMessage[]): ChatMessage[] {
    // check context messages token size
    const tokenEncoder = encoding_for_model(this.chatConfig.model as TiktokenModel);
    while (this.getMessagesTokenSize(messages, tokenEncoder) > this.chatConfig.contextMaxTokens) {
      // if context messages token size is greater than contextMaxTokens, remove the first message
      messages.splice(1, 1);
    }
    // free token encoder
    tokenEncoder.free();
    return messages;
  }

  private getMessagesTokenSize(messages: ChatMessage[], tokenEncoder: Tiktoken) {
    let messagesTokenSize = 0;
    messages.forEach((message) => messagesTokenSize += tokenEncoder.encode(message.content).length);
    return messagesTokenSize;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async readResponse(result: ReadableStreamReadResult<any>) {
    if (result.done || this.stopFlag) {
      console.log("读取完成");
      this.setGenerating(false);
      return;
    }
    // This is a Uint8Array type byte array that needs to be decoded.
    // It is possible that a single data packet contains multiple independent blocks, which are split using "data:".
    const resultDecoded = decoder.decode(result.value);
    const dataList = resultDecoded.split("data:");
    // parse data
    for (const data of dataList) {
      const resultData = this.parsePieceData(data);
      if (!resultData) continue;
      // parse choices
      for (const choice of resultData.choices) {
        const content = choice.delta.content;
        // check content
        if (content) {
          this.appendAssistantMsgContent(content);
        }
      }
    }
    if (!this.reader) {
      this.setGenerating(false);
      return;
    }
    await this.readResponse(await this.reader.read());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parsePieceData(data: string): any | null {
    // skip empty data
    if (data.length === 0) {
      return null;
    }
    // [DONE] means the end of the data
    if (data.trim() === DATA_DONE_FLAG) {
      console.log("read data done");
      this.setGenerating(false);
      return null;
    }
    const resultData = this.parseResultData(data);
    // check error
    if (resultData.error) {
      throw new Error(resultData.error.message);
    }
    return resultData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseResultData(data: string): any | null {
    try {
      // parse json data
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`parse json data error: ${error}\nparse data: ${data}`);
    }
  }

  private addAssistantMessage() {
    chatTabsStore.addAssistantMessage(this.chatInfo.id, this.tabIndex);
    this.refreshCallbackFunc();
  }

  private pushUserMessage2ChatTab(message: string) {
    chatTabsStore.addUserMessage(this.chatInfo.id, this.tabIndex, message);
    this.refreshCallbackFunc();
  }

  private appendAssistantMsgContent(content: string) {
    chatTabsStore.appendAssistantMsgContent(this.chatInfo.id, this.tabIndex, content);
    this.refreshCallbackFunc();
  }

  private setErrorMsgContent(errorMsg: string) {
    chatTabsStore.setAssistantErrorMsgContent(this.chatInfo.id, this.tabIndex, errorMsg);
    this.setGenerating(false);
  }

  private setGenerating(generating: boolean) {
    chatTabsStore.setGenerating(this.chatInfo.id, this.tabIndex, generating);
  }

}
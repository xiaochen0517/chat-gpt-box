import {BaseRequest} from "@/utils/request/BaseRequest.ts";
import {BaseConfig, ChatInfo, ChatMessage, ChatOptions, ChatTabInfo} from "@/types/Store.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {RequestOptions} from "@/types/request/RequestOptions.ts";
import {ChatGptRequestBody, ChatGptRequestTypes} from "@/types/request/ChatGptRequestTypes.ts";
import {encoding_for_model, Tiktoken, TiktokenModel} from "tiktoken";

const CHAT_GPT_API_SUFFIX: string = "v1/chat/completions";
const HTTP_REQ_TYPE: string = "POST";
const decoder: TextDecoder = new TextDecoder('utf-8');
// global store
const configStore = useConfigStore();
const chatTabsStore = useChatTabsStore();

export class ChatGptRequest implements BaseRequest {

  chatInfo: ChatInfo;

  refreshCallbackFunc: () => void = () => {
  };

  requestOptions: RequestOptions | null = null;

  stopFlag: boolean = false;

  chatConfig: ChatGptRequestTypes | null = null;

  abortController: AbortController | null = null;

  reader: ReadableStreamDefaultReader | null = null;

  constructor(chatInfo: ChatInfo) {
    this.chatInfo = chatInfo;
  }

  public sendMessage(requestOptions: RequestOptions, refreshCallbackFunc: () => void): Promise<string> {
    try {
      this.checkParams(requestOptions, refreshCallbackFunc);
      this.requestOptions = requestOptions;
      this.refreshCallbackFunc = refreshCallbackFunc;
      this.chatConfig = this.getChatConfig();
      return this.requestOpenAI();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return Promise.reject(error.message);
      }
      console.error(error);
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

  private getChatConfig(): ChatGptRequestTypes {
    const config: ChatOptions | BaseConfig = this.chatInfo.options.enabled ? this.chatInfo.options : configStore.baseConfig;
    return {
      apiUrl: config.apiUrl,
      model: config.model,
      temperature: config.temperature,
      context_max_message: config.context_max_message,
      context_max_tokens: config.context_max_tokens,
      response_max_tokens: config.response_max_tokens,
    };
  }

  private checkParams(requestOptions: RequestOptions, refreshCallbackFunc: () => void): void {
    console.log("message: ", requestOptions);
    console.log("refreshFunc: ", refreshCallbackFunc);
    if (!refreshCallbackFunc) throw new Error("refresh callback invalid");
    if (!requestOptions) throw new Error("request options is null");
    if (!(requestOptions.tabIndex >= 0)) throw new Error("tab index invalid");
    if (!requestOptions.message) throw new Error("message invalid");
  }

  private requestOpenAI(): Promise<string> {
    this.abortController = new AbortController();
    const url: string = this.chatConfig?.apiUrl + CHAT_GPT_API_SUFFIX;
    let request: RequestInit = this.generateRequest();
    return this.sendFetch(url, request);
  }

  private sendFetch(url: string, request: RequestInit): Promise<string> {
    this.addAssistantMessage();
    fetch(url, request)
        .then(async (data: Response) => {
          if (!data.ok || data.status !== 200 || !data.body) {
            this.setErrorMsgContent(`request failure status：${data.status}，message：${data.statusText}`);
            return;
          }
          try {
            this.reader = data.body.getReader();
            await this.readResponse(await this.reader.read());
          } catch (error) {
            console.error(error);
            if (error instanceof Error) {
              this.setErrorMsgContent(error.message);
            } else {
              this.setErrorMsgContent(String(error));
            }
          }
        })
        .catch((error) => {
          console.error(error);
          this.setErrorMsgContent(error.message);
        });
    return Promise.resolve("");
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
      "Authorization": "Bearer " + configStore.baseConfig.apiKey,
    };
  }

  private generateRequestBody(): ChatGptRequestBody {
    if (!this.chatConfig) throw new Error("chat config is null");
    return {
      messages: this.getMessage2Send(),
      model: this.chatConfig.model,
      stream: true,
      temperature: this.chatConfig.temperature,
      max_tokens: this.chatConfig.response_max_tokens > 0 ? this.chatConfig.response_max_tokens : undefined,
    };
  }

  private getMessage2Send(): ChatMessage[] {
    // there request options absolutely not null, but typescript compiler not know
    if (!this.requestOptions) throw new Error("request options is null");
    this.pushUserMessage2ChatTab(this.requestOptions.tabIndex);
    const chatTabInfo = this.getChatTabInfo(this.requestOptions.tabIndex);
    let messages: ChatMessage[] = this.getMaxContextMessage(chatTabInfo);
    messages = this.filterMessagesWithTokenLimit(messages);
    messages.unshift({role: "system", content: this.chatInfo.prompt});
    console.log("send messages: ", messages);
    return messages;
  }

  private pushUserMessage2ChatTab(tabIndex: number) {
    if (!this.requestOptions) throw new Error("request options is null");
    chatTabsStore.addUserMessage(this.chatInfo.id, tabIndex, this.requestOptions.message);
  }

  private getChatTabInfo(tabIndex: number): ChatTabInfo {
    const chatTabInfo = chatTabsStore.getChatTabInfo(this.chatInfo.id, tabIndex);
    if (!chatTabInfo) throw new Error("chat tab info is null");
    return chatTabInfo;
  }

  private getMaxContextMessage(chatTabInfo: ChatTabInfo): ChatMessage[] {
    if (!this.chatConfig) throw new Error("chat config is null");
    let tabChatLength = chatTabInfo.chat.length;
    let messages: ChatMessage[] = [];
    // context_max_message plus 1, because the last message is user new message
    const maxContextMinCount = tabChatLength - (this.chatConfig.context_max_message + 1);
    for (let i = tabChatLength - 1; i >= maxContextMinCount; i--) {
      const chatMessage = chatTabInfo.chat[i];
      if (chatMessage.role === "system") continue;
      messages.unshift(chatMessage);
    }
    return messages;
  }

  private filterMessagesWithTokenLimit(messages: ChatMessage[]): ChatMessage[] {
    if (!this.chatConfig) throw new Error("chat config is null");
    // check context messages token size
    const tokenEncoder = encoding_for_model(this.chatConfig.model as TiktokenModel);
    while (this.getMessagesTokenSize(messages, tokenEncoder) > this.chatConfig.context_max_tokens) {
      // if context messages token size is greater than context_max_tokens, remove the first message
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

  private addAssistantMessage() {
    if (!this.requestOptions) throw new Error("request options is null");
    chatTabsStore.addAssistantMessage(this.chatInfo.id, this.requestOptions.tabIndex);
  }

  private async readResponse(result: ReadableStreamReadResult<any>) {
    if (result.done || this.stopFlag) {
      console.log("读取完成");
      this.setGenerating(false);
      return;
    }
    // This is a Uint8Array type byte array that needs to be decoded.
    // It is possible that a single data packet contains multiple independent blocks, which are split using "data:".
    let dataList = decoder.decode(result.value).split("data:");
    // parse data
    for (let data of dataList) {
      // skip empty data
      if (data.length === 0) {
        continue;
      }
      // [DONE] means the end of the data
      if (data.trim() === "[DONE]") {
        console.log("read data done");
        this.setGenerating(false);
        return;
      }
      // parse json data
      let resultData = JSON.parse(data);
      // check error
      if (resultData.error) {
        this.setErrorMsgContent(resultData.error.message);
        return;
      }
      // parse choices
      for (let choice of resultData.choices) {
        let content = choice.delta.content;
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
    try {
      await this.readResponse(await this.reader.read());
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.setErrorMsgContent(errorMessage);
    }
  };

  private appendAssistantMsgContent(content: string) {
    if (!this.requestOptions) throw new Error("request options is null");
    chatTabsStore.appendAssistantMsgContent(this.chatInfo.id, this.requestOptions.tabIndex, content);
    this.refreshCallbackFunc();
  }

  private setErrorMsgContent(errorMsg: string) {
    if (!this.requestOptions) throw new Error("request options is null");
    chatTabsStore.setAssistantErrorMsgContent(this.chatInfo.id, this.requestOptions.tabIndex, errorMsg);
    this.setGenerating(false);
  }

  private setGenerating(generating: boolean) {
    if (!this.requestOptions) throw new Error("request options is null");
    chatTabsStore.setGenerating(this.chatInfo.id, this.requestOptions.tabIndex, generating);
  }

}
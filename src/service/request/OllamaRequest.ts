import {BaseRequest, getErrorMessage} from "@/service/request/BaseRequest.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {ChatGptRequestBody} from "@/types/request/ChatGptRequest.ts";
import {encoding_for_model, Tiktoken, TiktokenModel} from "tiktoken";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {ChatMessage, ChatMessageRole} from "@/types/chat/ChatTabInfo.ts";
import {OpenAiChatGptConfig} from "@/types/chat/BaseConfig.ts";
import logger from "@/utils/logger/Logger.ts";

const CHAT_GPT_API_SUFFIX: string = "v1/chat/completions";
const HTTP_REQ_TYPE: string = "POST";
const decoder: TextDecoder = new TextDecoder("utf-8");
// global store
const chatTabsStore = useChatTabsStore();

const DATA_DONE_FLAG: string = "[DONE]";

enum ErrorType {
  JSON_PARSE_ERROR = "JSON_PARSE_ERROR",
  PARSE_DONE = "PARSE_DONE",
}

class ParseDataError implements Error {
  name: string;
  public message: string;
  public type: ErrorType;
  public json: string;

  constructor(message: string = "ERROR", type: ErrorType = ErrorType.PARSE_DONE, json: string = "") {
    this.name = "ParseDataError";
    this.message = message;
    this.type = type;
    this.json = json;
  }

}

export class OllamaRequest implements BaseRequest {

  chatInfo: ChatInfo;

  chatConfig: OpenAiChatGptConfig;

  tabIndex: number;

  refreshCallbackFunc: () => void = () => {
  };

  stopFlag: boolean = false;

  abortController: AbortController | null = null;

  reader: ReadableStreamDefaultReader | null = null;

  /**
   * response json may be incomplete, so we need to save the error json and append it to the next response json
   */
  errorJson: string | null = null;

  constructor(chatInfo: ChatInfo, tabIndex: number, refreshCallbackFunc: () => void | null) {
    this.chatInfo = chatInfo;
    this.chatConfig = chatInfo.options as OpenAiChatGptConfig;
    this.tabIndex = tabIndex;
    if (refreshCallbackFunc) this.refreshCallbackFunc = refreshCallbackFunc;
  }

  public sendMessage(message: string): Promise<string> {
    this.abortController = new AbortController();
    this.stopFlag = false;
    this.errorJson = null;
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
      logger.info("read cancel");
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
      .catch((error) => this.handleFetchError(error));
    return Promise.resolve("");
  }

  private handleFetchError(error: Error): void {
    console.error(error);
    this.setErrorMsgContent(error.message);
  }

  private handleFetchResponse = async (data: Response): Promise<void> => {
    try {
      if (!await this.checkFetchResponse(data)) return;
      if (!data.body) throw new Error("response body is null");
      this.reader = data.body.getReader();
      await this.readResponse(await this.reader.read());
    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : String(error);
      this.setErrorMsgContent(errMsg);
    }
  };

  private checkFetchResponse = async (data: Response): Promise<boolean> => {
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
  };

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
    let messages: ChatMessage[] = this.getMaxContextMessage();
    messages = this.filterMessagesWithTokenLimit(messages);
    messages.unshift({role: ChatMessageRole.System, content: this.chatInfo.prompt});
    return messages;
  }

  private getMaxContextMessage(): ChatMessage[] {
    const chatTabInfo = chatTabsStore.getChatTabInfo(this.chatInfo.id, this.tabIndex);
    if (!chatTabInfo || chatTabInfo.chat.length === 0) return [];
    const messages: ChatMessage[] = chatTabInfo.chat.slice(1, chatTabInfo.chat.length - 1);
    // get max context messages
    if (messages.length <= this.chatConfig.contextMaxMessage) return messages;
    return messages.slice(messages.length - this.chatConfig.contextMaxMessage - 1, messages.length);
  }

  private filterMessagesWithTokenLimit(messages: ChatMessage[]): ChatMessage[] {
    // check context messages token size, ollama default use 'gpt-3.5-turbo' model for token encoding
    const tokenEncoder = encoding_for_model("gpt-3.5-turbo" as TiktokenModel);
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
  private readResponse = async (result: ReadableStreamReadResult<any>): Promise<void> => {
    if (result.done || this.stopFlag) {
      logger.info("load data done");
      this.setGenerating(false);
      return;
    }
    // This is a Uint8Array type byte array that needs to be decoded.
    // It is possible that a single data packet contains multiple independent blocks, which are split using "data:".
    let resultDecoded = decoder.decode(result.value);
    if (this.errorJson && this.errorJson.length > 0) {
      // append error json
      this.errorJson += resultDecoded;
      resultDecoded = this.errorJson;
      this.errorJson = null;
    }
    const dataList = resultDecoded.split("data:");
    // parse data
    try {
      this.parseDataList(dataList);
    } catch (error: unknown) {
      if (!(error instanceof ParseDataError)) throw error;
      // check error type
      if (error.type === ErrorType.JSON_PARSE_ERROR) {
        // save error json
        this.errorJson = error.json;
      } else {
        throw error;
      }
    }
    if (!this.reader) {
      this.setGenerating(false);
      return;
    }
    await this.readResponse(await this.reader.read());
  };

  private parseDataList(dataList: string[]): void {
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parsePieceData(data: string): any | null {
    // skip empty data
    if (!data || data.trim().length === 0) {
      return null;
    }
    // [DONE] means the end of the data
    if (data.trim() === DATA_DONE_FLAG) {
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
      throw new ParseDataError(
        `parse json data error: ${error}\nparse data: ${data}`,
        ErrorType.JSON_PARSE_ERROR,
        data,
      );
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
    this.refreshCallbackFunc();
    this.setGenerating(false);
  }

  private setGenerating(generating: boolean) {
    chatTabsStore.setGenerating(this.chatInfo.id, this.tabIndex, generating);
  }

}

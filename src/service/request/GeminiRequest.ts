import {BaseRequest, checkFetchResponse, getErrorMessage} from "@/service/request/BaseRequest.ts";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {GoogleGeminiConfig} from "@/types/chat/BaseConfig.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {ChatMessage, ChatMessageRole} from "@/types/chat/ChatTabInfo.ts";
import {GeminiRequestParams, GenerationConfig} from "@/types/request/GeminiRequest.ts";

// global store
const configStore = useConfigStore();
const chatTabsStore = useChatTabsStore();

const decoder: TextDecoder = new TextDecoder("utf-8");

export class GeminiRequest implements BaseRequest {

  chatInfo: ChatInfo;

  chatConfig: GoogleGeminiConfig;

  tabIndex: number;

  refreshCallbackFunc = () => {
  };

  stopFlag: boolean = false;

  reader: ReadableStreamDefaultReader | null = null;

  constructor(chatInfo: ChatInfo, tabIndex: number, refreshCallbackFunc: () => void | null) {
    this.chatInfo = chatInfo;
    this.chatConfig = chatInfo.options as GoogleGeminiConfig;
    this.tabIndex = tabIndex;
    if (refreshCallbackFunc) this.refreshCallbackFunc = refreshCallbackFunc;
  }

  sendMessage(message: string): Promise<string> {
    this.stopFlag = false;
    this.setGenerating(true);
    try {
      this.pushUserMessage2ChatTab(message);
      this.addAssistantMessage();
      const apiKey = this.getApiKey();
      this.sendFetch(apiKey).then(() => {
      });
      return Promise.resolve("done");
    } catch (error) {
      const message = getErrorMessage(error);
      this.setErrorMsgContent(message);
      return Promise.reject(error);
    }
  }

  private async sendFetch(apiKey: string) {
    fetch(
      `${this.chatConfig.apiUrl}v1beta/models/${this.chatConfig.model}:streamGenerateContent?key=${apiKey}`,
      await this.generateRequest(apiKey))
      .then(this.handleFetchResponse)
      .catch(this.handleFetchError);
  }

  private getApiKey(): string {
    const apiKey = configStore.defaultChatConfig.google.base.apiKey;
    if (!apiKey) {
      throw new Error("Please enter the Gemini API key in the settings.");
    }
    return apiKey;
  }

  private async generateRequest(apiKey: string): Promise<RequestInit> {
    try {
      const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(apiKey);
      const model: GenerativeModel = genAI.getGenerativeModel({model: this.chatConfig.model});
      const startChatParams = await this.getStartChatParams(model);
      return {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(startChatParams),
      };
    } catch (error) {
      const message = getErrorMessage(error);
      this.setErrorMsgContent(message);
      return Promise.reject(error);
    }
  }

  private handleFetchResponse = async (data: Response): Promise<void> => {
    try {
      const errorMessage = await checkFetchResponse(data);
      if (errorMessage) {
        this.setErrorMsgContent(errorMessage);
        return;
      }
      if (!data.body) throw new Error("response body is null");
      this.reader = data.body.getReader();
      await this.readResponse(await this.reader.read());
      this.setGenerating(false);
    } catch (error) {
      const message = getErrorMessage(error);
      this.setErrorMsgContent(message);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readResponse = async (result: ReadableStreamReadResult<any>): Promise<void> => {
    if (result.done || this.stopFlag) {
      console.log("读取完成");
      return;
    }
    if (!this.reader) {
      return;
    }
    // This is a Uint8Array type byte array that needs to be decoded.
    // It is possible that a single data packet contains multiple independent blocks, which are split using "data:".
    let resultDecoded = decoder.decode(result.value).trim();
    if (resultDecoded.startsWith("[") || resultDecoded.startsWith("]") || resultDecoded.startsWith(",")) {
      // remove "[", "]" and "," from the beginning of the string
      resultDecoded = resultDecoded.substring(1).trim();
    }
    if (resultDecoded.endsWith("]")) {
      // remove "]" from the end of the string
      resultDecoded = resultDecoded.substring(0, resultDecoded.length - 1).trim();
    }
    if (!resultDecoded || resultDecoded.length === 0) {
      await this.readResponse(await this.reader.read());
      return;
    }
    try {
      // parse json data
      const resultObject = JSON.parse(resultDecoded);
      const candidates = resultObject.candidates;
      const content = candidates[0].content;
      const parts = content.parts;
      const text = parts[0].text;
      // check content
      if (text) {
        this.appendAssistantMsgContent(text);
      }
    } catch (error) {
      console.error("parse result json object error", error);
      console.error("error result", resultDecoded);
    }
    await this.readResponse(await this.reader.read());
  };

  private handleFetchError = (error: Error): void => {
    console.error(error);
    this.setErrorMsgContent(error.message);
  };

  private async getStartChatParams(model: GenerativeModel): Promise<GeminiRequestParams> {
    const generationConfig: GenerationConfig = this.getGenerationConfig();
    const chatTabInfo = chatTabsStore.getChatTabInfo(this.chatInfo.id, this.tabIndex);
    if (!chatTabInfo) {
      throw new Error("chatTabInfo is null");
    }
    if (chatTabInfo.chat.length <= 2) {
      throw new Error("chatTabInfo less or equal than 2");
    }
    const chatMessageList: ChatMessage[] = chatTabInfo.chat.slice(1, chatTabInfo.chat.length - 1);
    const sendMessages: ChatMessage[] = [];
    let sendMessagesTokenCount = 0;
    for (let index = chatMessageList.length - 1; index >= 0; index--) {
      const chatMessage = chatMessageList[index];
      sendMessagesTokenCount += (await model.countTokens(chatMessage.content)).totalTokens;
      // Since the messages submitted by Gemini must be a user message corresponding to an assistant message,
      // it is necessary to ensure that the historical message must start with user on the basis of max message
      if (sendMessagesTokenCount > this.chatConfig.contextMaxTokens
        || (sendMessages.length >= this.chatConfig.contextMaxMessage + 1 && chatMessage.role === ChatMessageRole.Assistant)) {
        break;
      }
      sendMessages.unshift(chatMessage);
    }
    sendMessages.unshift({role: ChatMessageRole.Assistant, content: "ok."});
    sendMessages.unshift(chatTabInfo.chat[0]);
    return {
      contents: sendMessages.map((chatMessage) => {
        return {
          role: chatMessage.role === "assistant" ? "model" : "user",
          parts: [{text: chatMessage.content}],
        };
      }),
      generationConfig: generationConfig,
    };
  }

  private getGenerationConfig(): GenerationConfig {
    return {
      maxOutputTokens: this.chatConfig.maxOutputTokens > 0 ? this.chatConfig.maxOutputTokens : undefined,
      temperature: this.chatConfig.temperature,
      topK: this.chatConfig.topK,
      topP: this.chatConfig.topP,
    };
  }

  cancel(): void {
    this.stopFlag = true;
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

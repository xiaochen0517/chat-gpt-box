import {BaseRequest, getErrorMessage} from "@/service/request/BaseRequest.ts";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {
  ChatSession,
  GenerationConfig,
  GenerativeModel,
  GoogleGenerativeAI,
  StartChatParams
} from "@google/generative-ai";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {GoogleGeminiConfig} from "@/types/chat/BaseConfig.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {ChatMessage} from "@/types/chat/ChatTabInfo.ts";

// global store
const configStore = useConfigStore();
const chatTabsStore = useChatTabsStore();

export class GeminiRequest implements BaseRequest {

  chatInfo: ChatInfo;

  chatConfig: GoogleGeminiConfig;

  tabIndex: number;

  refreshCallbackFunc = () => {
  };

  stopFlag: boolean = false;

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
      this.geminiSendMessage(message, apiKey).then(() => {
      });
      return Promise.resolve("done");
    } catch (error) {
      const message = getErrorMessage(error);
      this.setErrorMsgContent(message);
      return Promise.reject(error);
    }
  }

  private async geminiSendMessage(message: string, apiKey: string): Promise<void> {
    const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(apiKey);
    const model: GenerativeModel = genAI.getGenerativeModel({model: this.chatConfig.model});
    const startChatParams = await this.getStartChatParams(model);
    const chat: ChatSession = model.startChat(startChatParams);
    const result = await chat.sendMessageStream(message);
    for await (const chunk of result.stream) {
      if (this.stopFlag) {
        this.stopFlag = false;
        this.setErrorMsgContent("User Canceled.");
        break;
      }
      const chunkText = chunk.text();
      this.appendAssistantMsgContent(chunkText);
    }
    this.setGenerating(false);
    return Promise.resolve();
  }

  private getApiKey(): string {
    const apiKey = configStore.defaultChatConfig.google.base.apiKey;
    if (!apiKey) {
      throw new Error("Please enter the Gemini API key in the settings.");
    }
    return apiKey;
  }

  private async getStartChatParams(model: GenerativeModel): Promise<StartChatParams> {
    const generationConfig: GenerationConfig = this.getGenerationConfig();
    const chatTabInfo = chatTabsStore.getChatTabInfo(this.chatInfo.id, this.tabIndex);
    if (!chatTabInfo) {
      throw new Error("chatTabInfo is null");
    }
    if (chatTabInfo.chat.length <= 3) {
      return {
        history: [{
          role: "user",
          parts: this.chatInfo.prompt,
        }],
        generationConfig: generationConfig
      };
    }
    const chatMessageList = chatTabInfo.chat.slice(1, chatTabInfo.chat.length - 2);
    const sendMessages: ChatMessage[] = [];
    let sendMessagesTokenCount = 0;
    for (let index = chatMessageList.length - 1; index >= 0; index--) {
      const chatMessage = chatMessageList[index];
      sendMessagesTokenCount += (await model.countTokens(chatMessage.content)).totalTokens;
      if (sendMessagesTokenCount > this.chatConfig.contextMaxTokens
        || sendMessages.length >= this.chatConfig.contextMaxMessage) {
        break;
      }
      sendMessages.unshift(chatMessage);
    }
    return {
      history: sendMessages.map((chatMessage) => {
        return {
          role: chatMessage.role === "assistant" ? "model" : "user",
          parts: chatMessage.content,
        };
      }),
      generationConfig: generationConfig
    };
  }

  private getGenerationConfig(): GenerationConfig {
    return {
      maxOutputTokens: this.chatConfig.maxOutputTokens,
      temperature: this.chatConfig.temperature,
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
    this.setGenerating(false);
  }

  private setGenerating(generating: boolean) {
    chatTabsStore.setGenerating(this.chatInfo.id, this.tabIndex, generating);
  }
}
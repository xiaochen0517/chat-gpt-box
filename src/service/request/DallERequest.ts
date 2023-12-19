import {BaseRequest, getErrorMessage} from "@/service/request/BaseRequest.ts";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import axios, {AxiosError, AxiosResponse} from "axios";
import {DallEChatRequestBody} from "@/types/request/DallERequestTypes.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import AppUtil from "@/utils/AppUtil.ts";
import {OpenAiDallEConfig} from "@/types/chat/BaseConfig.ts";

// global store
const configStore = useConfigStore();
const chatTabsStore = useChatTabsStore();
const imgWidth = AppUtil.isMobile() ? "90%" : "400px";

export class DallERequest implements BaseRequest {

  chatInfo: ChatInfo;

  chatConfig: OpenAiDallEConfig;

  tabIndex: number;

  refreshCallbackFunc: () => void = () => {
  };

  stopFlag: boolean = false;

  constructor(chatInfo: ChatInfo, tabIndex: number, refreshCallbackFunc: () => void | null) {
    this.chatInfo = chatInfo;
    this.chatConfig = chatInfo.options as OpenAiDallEConfig;
    this.tabIndex = tabIndex;
    if (refreshCallbackFunc) this.refreshCallbackFunc = refreshCallbackFunc;
  }

  sendMessage(message: string): Promise<string> {
    this.stopFlag = false;
    this.setGenerating(true);
    try {
      this.prepareMessage(message);
      return this.sendRequest(message);
    } catch (error) {
      const message = getErrorMessage(error);
      this.setErrorMsgContent(message);
      return Promise.reject(error);
    }
  }

  private sendRequest(message: string): Promise<string> {
    axios.post(
      `${this.chatConfig.apiUrl}v1/images/generations`,
      this.getChatRequestBody(message),
      {
        headers: this.getChatRequestHeaders(),
        timeout: 1000 * 60 * 2,
      })
      .then(this.handleResponse)
      .catch(this.handleErrorResponse);
    return Promise.resolve("done");
  }

  private prepareMessage(message: string): void {
    this.pushUserMessage2ChatTab(message);
    this.addAssistantMessage();
    this.setAssistantMsgContent("Generating...");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private checkResponse(response: AxiosResponse<any, any>): boolean {
    if (this.stopFlag) {
      this.stopFlag = false;
      return false;
    }
    if (response.status !== 200) {
      this.setErrorMsgContent("Error: " + response.data);
      return false;
    }
    const data = response.data;
    if (!data || data.data.length < 1) {
      this.setErrorMsgContent(`Error: \n\`\`\`json\n${data}\n\`\`\`\n`);
      return false;
    }
    return true;
  }

  private getChatRequestBody(message: string): DallEChatRequestBody {
    return {
      prompt: message,
      model: this.chatConfig.model,
      n: this.chatConfig.model === "dall-e-3" ? 1 : this.chatConfig.imageCount,
      quality: this.chatConfig.model === "dall-e-3" ? this.chatConfig.imageQuality : undefined,
      size: this.chatConfig.imageSize,
      style: this.chatConfig.model === "dall-e-3" ? this.chatConfig.imageStyle : undefined,
    };
  }

  private getChatRequestHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + configStore.defaultChatConfig.openAi.base.apiKey,
    };
  }

  private handleResponse(response: AxiosResponse): void {
    if (!this.checkResponse(response)) return;
    console.log("response: ", response);
    const data = response.data.data;
    let content = "";
    for (const item of data) {
      content += `Revised prompt: \`${item.revised_prompt ?? "None revised"}\`\n\nGenerated image: \n\n` +
        `<img src="${item.url}" width="${imgWidth}"/>\n\n`;
    }
    this.setAssistantMsgContent(content);
    this.setGenerating(false);
  }

  private handleErrorResponse(error: AxiosError): void {
    if (this.stopFlag) {
      this.stopFlag = false;
      return;
    }
    console.error(error);
    let errorContent = `Error message: \`${error.message}\`\n\n`;
    if (error.response) {
      errorContent += `Error response: \n\`\`\`json\n${JSON.stringify(error.response.data)}\n\`\`\`\n`;
    }
    this.setErrorMsgContent(errorContent);
  }

  cancel(): void {
    this.stopFlag = true;
  }

  private pushUserMessage2ChatTab(message: string) {
    chatTabsStore.addUserMessage(this.chatInfo.id, this.tabIndex, message);
    this.refreshCallbackFunc();
  }

  private addAssistantMessage() {
    chatTabsStore.addAssistantMessage(this.chatInfo.id, this.tabIndex);
    this.refreshCallbackFunc();
  }

  private setAssistantMsgContent(content: string) {
    chatTabsStore.setAssistantMsgContent(this.chatInfo.id, this.tabIndex, content);
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
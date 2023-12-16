import {BaseRequest, checkParams} from "@/service/request/BaseRequest.ts";
import {RequestOptionsTypes} from "@/types/request/RequestOptionsTypes.ts";
import {ChatInfoTypes, DallEChatOptions} from "@/types/chat/ChatInfoTypes.ts";
import axios, {AxiosError, AxiosResponse} from "axios";
import {DallEChatRequestBody} from "@/types/request/DallERequestTypes.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import AppUtil from "@/utils/AppUtil.ts";

// global store
const configStore = useConfigStore();
const chatTabsStore = useChatTabsStore();
const imgWidth = AppUtil.isMobile() ? "90%" : "400px";

export class DallERequest implements BaseRequest {

  chatInfo: ChatInfoTypes;

  refreshCallbackFunc: () => void = () => {
  };

  requestOptions: RequestOptionsTypes | null = null;

  stopFlag: boolean = false;

  constructor(chatInfo: ChatInfoTypes) {
    this.chatInfo = chatInfo;
  }

  sendMessage(requestOptions: RequestOptionsTypes, refreshCallbackFunc: () => void): Promise<string> {
    try {
      checkParams(requestOptions, refreshCallbackFunc);
      this.requestOptions = requestOptions;
      this.refreshCallbackFunc = refreshCallbackFunc;
      this.setGenerating(true);
      this.prepareMessage();
      const config = this.getChatConfig();
      const chatRequestBody = this.getChatRequestBody(config);
      console.log("chatRequestBody: ", chatRequestBody);
      axios.post(
        `${config.apiUrl}v1/images/generations`,
        chatRequestBody,
        {
          headers: this.getChatRequestHeaders(),
          timeout: 1000 * 60 * 2,
        })
        .then((response) => {
          this.handleResponse(response);
        })
        .catch((error) => {
          this.handleErrorResponse(error);
        });
      return Promise.resolve("done");
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  private prepareMessage(): void {
    this.pushUserMessage2ChatTab();
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

  private getChatConfig(): DallEChatOptions {
    return this.chatInfo.options as DallEChatOptions;
  }

  private getChatRequestBody(config: DallEChatOptions): DallEChatRequestBody {
    if (!this.requestOptions || !this.requestOptions.message) throw new Error("request options is null");
    return {
      prompt: this.requestOptions.message,
      model: config.model,
      n: config.model === "dall-e-3" ? 1 : config.imageCount,
      quality: config.model === "dall-e-3" ? config.imageQuality : undefined,
      size: config.imageSize,
      style: config.model === "dall-e-3" ? config.imageStyle : undefined,
    };
  }

  private getChatRequestHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + configStore.baseConfig.apiKey,
    };
  }

  private handleResponse(response: AxiosResponse): void {
    if (!this.checkResponse(response)) return;
    console.log("response: ", response);
    const data = response.data.data;
    let content = "";
    for (const item of data) {
      content += `Revised prompt: \`${item.revised_prompt??"None revised"}\`\n\nGenerated image: \n\n` +
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

  private pushUserMessage2ChatTab() {
    if (!this.requestOptions) throw new Error("request options is null");
    chatTabsStore.addUserMessage(this.chatInfo.id, this.requestOptions.tabIndex, this.requestOptions.message);
    this.refreshCallbackFunc();
  }

  private addAssistantMessage() {
    if (!this.requestOptions) throw new Error("request options is null");
    chatTabsStore.addAssistantMessage(this.chatInfo.id, this.requestOptions.tabIndex);
    this.refreshCallbackFunc();
  }

  private setAssistantMsgContent(content: string) {
    if (!this.requestOptions) throw new Error("request options is null");
    chatTabsStore.setAssistantMsgContent(this.chatInfo.id, this.requestOptions.tabIndex, content);
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
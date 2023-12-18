import {BaseRequest} from "@/service/request/BaseRequest.ts";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {RequestOptions} from "@/types/request/RequestOptions.ts";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {GoogleGeminiConfig} from "@/types/chat/BaseConfig.ts";

// global store
const configStore = useConfigStore();

class GeminiRequest implements BaseRequest {

  chatInfo: ChatInfo;

  refreshCallbackFunc: () => void;

  requestOptions: RequestOptions | null;

  stopFlag: boolean;

  constructor(chatInfo: ChatInfo) {
    this.chatInfo = chatInfo;
  }

  async sendMessage(requestOptions: RequestOptions, refreshCallbackFunc: () => void): Promise<string> {
    const genAI = new GoogleGenerativeAI(this.getApiKey());
    const config: GeminiRequestOption = this.getChatConfig();
    const model = genAI.getGenerativeModel({model: config.model});
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "Hello, I have 2 dogs in my house.",
        },
        {
          role: "model",
          parts: "Great to meet you. What would you like to know?",
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const msg = "How many paws are in my house?";
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return Promise.resolve("done");
  }

  private getApiKey(): string {
    const apiKey = configStore.defaultChatConfig.google.base.apiKey;
    if (!apiKey) {
      throw new Error("Please enter the Gemini API key in the settings.");
    }
    return apiKey;
  }

  private getChatConfig(): GoogleGeminiConfig {
    return this.chatInfo.options;
  }

  cancel(): void {
    this.stopFlag = true;
  }
}
import _ from "lodash";
import {RequestBody, RobotOptions, SendRequest} from "@/types/SendRequest.ts";
import {ChatMessage} from "@/types/Store.ts";
import {encoding_for_model, Tiktoken, TiktokenModel} from "tiktoken";
import {useConfigStore} from "@/store/Config.ts";
import {useChatTabsStore} from "@/store/ChatTabs.ts";
import {useChatListStore} from "@/store/ChatList.ts";

// gpt api url
const API_URL: string = "v1/chat/completions";
// request method
const REQ_TYPE: string = "POST";
// charset decoder
const decoder: TextDecoder = new TextDecoder('utf-8');
// global store
const configStore = useConfigStore();
const chatTabsStore = useChatTabsStore();
const chatListStore = useChatListStore();

export class RequestUtil {
  // stream读取器
  reader: ReadableStreamDefaultReader | null = null;
  changeFunc: () => void = () => {
  };

  data: SendRequest = {
    chatId: "",
    tabIndex: 0,
    content: "",
  };

  stopFlag: boolean = false;

  abortController: AbortController | null = null;

  sendRequest = async (data: SendRequest, change: () => void) => {
    if (change) {
      this.changeFunc = change;
    }
    // check and init data
    this.checkRequestData(data);
    this.data = data;
    try {
      // set tab status to generating
      this.setGenerating(true);
      // add user message into chat history
      this.addUserMessage();
      // get chat config
      const chatOptions = this.getRobotOptions();
      const messages = await this.getContextMessages(chatOptions);
      console.log("send messages = ", messages);
      // add assistant message into chat history
      this.addAssistantMessage();
      // send fetch request
      this.sendFetch(messages, chatOptions);
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.setErrorMsgContent(exception.message);
      } else {
        console.error(exception);
        this.setErrorMsgContent(String(exception));
      }
      // generated finished
      this.setGenerating(false);
    }
  }

  getContextMessages = async (options: RobotOptions) => {
    // clone chat history
    let messages = _.cloneDeep(chatTabsStore.chatTabs[this.data.chatId][this.data.tabIndex].chat);
    if (options.context_max_message <= 0 || options.context_max_tokens <= 0) {
      return [messages[0], messages[messages.length - 1]];
    }
    // get context messages
    let contextMessages: ChatMessage[];
    if (options.context_max_message >= messages.length - 1) {
      contextMessages = messages;
    } else {
      const systemMessage = messages[0];
      contextMessages = [systemMessage, ...messages.slice(-(options.context_max_message + 1))];
    }
    // check context messages token size
    const tokenEncoder = encoding_for_model(options.model as TiktokenModel);
    while (this.getMessagesTokenSize(contextMessages, tokenEncoder) > options.context_max_tokens) {
      // if context messages token size is greater than context_max_tokens, remove the first message
      if (contextMessages.length === 1) {
        // only one message, is system message, break
        break;
      }
      // remove the first message except system message
      contextMessages.splice(1, 1);
    }
    // free token encoder
    tokenEncoder.free();
    return contextMessages;
  }

  getMessagesTokenSize = (messages: ChatMessage[], tokenEncoder: Tiktoken) => {
    let messagesTokenSize = 0;
    messages.forEach((message) => messagesTokenSize += tokenEncoder.encode(message.content).length);
    return messagesTokenSize;
  }

  cancel() {
    this.stopFlag = true;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
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

  checkRequestData = (data: SendRequest) => {
    console.log("check request data = ", data);
    if (data.content.length <= 0) {
      console.error("none message to send");
      throw Error("none message to send");
    }
    if (!data.chatId || data.chatId.length <= 0 || data.tabIndex < 0) {
      console.error("invalid index");
      throw Error("invalid index");
    }
  };

  buildHeaders = () => {
    const apiKey = configStore.baseConfig.apiKey;
    if (!apiKey || apiKey === "" || apiKey.length < 3) {
      throw Error("please config your api key");
    }
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  };

  buildBodyJson = (messages: ChatMessage[], options: RobotOptions) => {
    let requestObject: RequestBody = {
      messages,
      model: options.model,
      stream: true,
      temperature: options.temperature,
    };
    if (options.response_max_tokens > 0) {
      requestObject.max_tokens = options.response_max_tokens;
    }
    return JSON.stringify(requestObject);
  };

  sendFetch = (messages: ChatMessage[], options: RobotOptions) => {
    this.abortController = new AbortController();
    fetch(options.apiUrl + API_URL, {
      method: REQ_TYPE,
      headers: this.buildHeaders(),
      body: this.buildBodyJson(messages, options),
      signal: this.abortController.signal,
    }).then(async (data: Response) => {
      if (data.status !== 200 || !data.body) {
        this.setErrorMsgContent(`request failure status：${data.status}，message：${data.statusText}`);
        this.setGenerating(false);
        return;
      }
      try {
        this.reader = data.body.getReader();
        const result = await this.reader.read()
        await this.readResponse(result);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          this.setErrorMsgContent(error.message);
        } else {
          this.setErrorMsgContent(String(error));
        }
        this.setGenerating(false);
      }
    }).catch((error) => {
      console.error(error);
      this.setErrorMsgContent(error.message);
      this.setGenerating(false);
    });
  };

  readResponse = async (result: ReadableStreamReadResult<AllowSharedBufferSource>) => {
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
      this.setGenerating(false);
    }
  };

  addUserMessage() {
    chatTabsStore.addUserMessage(this.data.chatId, this.data.tabIndex, this.data.content);
    this.changeFunc();
  }

  addAssistantMessage = () => {
    chatTabsStore.addAssistantMessage(this.data.chatId, this.data.tabIndex);
    this.changeFunc();
  };

  appendAssistantMsgContent = (content: string) => {
    chatTabsStore.appendAssistantMsgContent(this.data.chatId, this.data.tabIndex, content);
    this.changeFunc();
  };

  setErrorMsgContent = (content: string) => {
    chatTabsStore.setAssistantErrorMsgContent(this.data.chatId, this.data.tabIndex, content);
    this.changeFunc();
  };

  setGenerating = (generating: boolean) => {
    if (this.reader) this.reader = null;
    if (this.abortController) this.abortController = null;
    chatTabsStore.setGenerating(this.data.chatId, this.data.tabIndex, generating);
  };

  getRobotOptions = (): RobotOptions => {
    let chatOptions = chatListStore.getChatInfo(this.data.chatId)?.options;
    if (!chatOptions || !chatOptions.enabled) {
      return configStore.baseConfig;
    }
    return chatOptions;
  }
}

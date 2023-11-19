import {useStore} from "@/store/store.ts";
import _ from "lodash";
import {RequestBody, RobotOptions, SendRequest} from "@/types/SendRequest.ts";
import {ChatMessage} from "@/types/State.ts";
import {encoding_for_model, Tiktoken, TiktokenModel} from "tiktoken";

// 请求地址
const API_URL: string = "v1/chat/completions";
// 请求方式
const REQ_TYPE: string = "POST";
// 字符解码器
const decoder: TextDecoder = new TextDecoder('utf-8');
// 全局store
const store = useStore();

export class RequestUtil {
  // stream读取器
  reader: ReadableStreamDefaultReader | null = null;
  changeFunc: () => void = () => {
  };

  data = {
    robotIndex: 0,
    tabIndex: 0,
    content: "",
  };

  stopFlag: boolean = false;

  sendRequest = async ({robotIndex, tabIndex, content}: SendRequest, change: () => void) => {
    if (change) {
      this.changeFunc = change;
    }
    // 检查并初始化数据
    this.checkRequestData(robotIndex, tabIndex, content);
    // 设置内容
    this.data = {
      robotIndex: robotIndex,
      tabIndex: tabIndex,
      content: content,
    };
    try {
      // encodeChat = await loadGptTokenizer();
      // 设置当前状态为生成中
      this.setGenerating(true);
      // 添加用户信息
      this.addUserMessage();
      // 获取配置信息
      const robotOptions = this.getRobotOptions(robotIndex);
      const messages = await this.getContextMessages(robotIndex, tabIndex, robotOptions);
      console.log("send messages = ", messages);
      // 添加助手信息
      this.addAssistantMessage();
      // 发送请求
      this.sendFetch(messages, robotOptions);
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        // 写入错误信息
        this.setAssistantMsgContent(exception.message);
      } else {
        console.error(exception);
        this.setAssistantMsgContent(String(exception));
      }
      // 当前状态为生成完成
      this.setGenerating(false);
    }
  }

  getContextMessages = async (robotIndex: number, tabIndex: number, options: RobotOptions) => {
    // 拷贝聊天记录，用于发送请求
    let messages = _.cloneDeep(store.chatHistory[robotIndex][tabIndex].chat);
    if (options.context_max_message <= 0 || options.context_max_tokens <= 0) {
      return [messages[0], messages[messages.length - 1]];
    }
    // 获取指定数量的上下文消息
    let contextMessages: ChatMessage[];
    if (options.context_max_message >= messages.length - 1) {
      contextMessages = messages;
    } else {
      const systemMessage = messages[0];
      contextMessages = [systemMessage, ...messages.slice(-(options.context_max_message + 1))];
    }
    // 初始化token编码器
    const tokenEncoder = encoding_for_model(options.model as TiktokenModel);
    while (this.getMessagesTokenSize(contextMessages, tokenEncoder) > options.context_max_tokens) {
      // 消息的token数量超过了最大token数量，需要删除消息
      if (contextMessages.length === 1) {
        // 只有一条消息，为prompt，无法删除
        break;
      }
      // 有多条消息，删除除了prompt之外的第一条消息
      contextMessages.splice(1, 1);
    }
    // 释放资源
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
    if (!this.reader) return;
    this.reader.cancel().then(() => {
      console.log("取消读取");
      this.reader = null;
    }).catch((error) => {
      console.error(error);
      this.reader = null;
    });
  }

  addUserMessage() {
    store.addUserMessage(this.data.robotIndex, this.data.tabIndex, this.data.content);
    this.changeFunc();
  }

  addAssistantMessage = () => {
    store.addAssistantMessage(this.data.robotIndex, this.data.tabIndex);
    this.changeFunc();
  };

  setAssistantMsgContent = (content: string) => {
    store.setAssistantMsgContent(this.data.robotIndex, this.data.tabIndex, content);
    this.changeFunc();
  };

  addAssistantMsgContent = (content: string) => {
    store.addAssistantMsgContent(this.data.robotIndex, this.data.tabIndex, content);
    this.changeFunc();
  };

  setGenerating = (generating: boolean) => {
    store.setGenerating(this.data.robotIndex, this.data.tabIndex, generating);
  };

  getRobotOptions = (robotIndex: number): RobotOptions => {
    let robotOptions = store.robotList[robotIndex].options;
    // 获取配置信息
    if (!robotOptions.enabled) {
      // 获取全局配置
      return store.config.base;
    }
    return robotOptions;
  }

  checkRequestData = (robotIndex: number, tabIndex: number, content: string) => {
    // 检查并初始化数据
    if (content.length <= 0) {
      console.error("无信息可发送");
      throw Error("无信息可发送");
    }
    if (!(robotIndex >= 0 && tabIndex >= 0)) {
      console.error("无效的索引");
      throw Error("无效的索引");
    }
  };

  buildHeaders = () => {
    const apiKey = store.config.base.apiKey;
    if (!apiKey || apiKey === "" || apiKey.length < 3) {
      throw Error("请输入正确的ApiKey");
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
    const controller = new AbortController();
    fetch(options.apiUrl + API_URL, {
      method: REQ_TYPE,
      headers: this.buildHeaders(),
      body: this.buildBodyJson(messages, options),
      signal: controller.signal,
    }).then(async (data: Response) => {
      if (data.status !== 200 || !data.body) {
        this.addAssistantMsgContent(`请求失败，状态码：${data.status}，状态信息：${data.statusText}`);
        // 当前状态为生成完成
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
          // 显示错误信息
          this.addAssistantMsgContent(error.message);
        } else {
          // 显示错误信息
          this.addAssistantMsgContent(String(error));
        }
        // 当前状态为生成完成
        this.setGenerating(false);
      }
    }).catch((error) => {
      console.error(error);
      // 显示错误信息
      this.addAssistantMsgContent(error.message);
      // 当前状态为生成完成
      this.setGenerating(false);
    });
  };

  readResponse = async (result: ReadableStreamReadResult<AllowSharedBufferSource>) => {
    if (result.done || this.stopFlag) {
      console.log("读取完成");
      this.setGenerating(false);
      return;
    }
    // 这是一个 Uint8Array 类型的字节数组，需要进行解码
    // 有可能获取的一个数据包中有多个独立的块，使用data:进行分割
    let dataList = decoder.decode(result.value).split("data:");
    // 循环解析
    for (let data of dataList) {
      // 跳过空字符串
      if (data.length === 0) {
        continue;
      }
      // 判断是否读取完成
      if (data.trim() === "[DONE]") {
        console.log("读取完成");
        this.setGenerating(false);
        return;
      }
      // 解析返回的json格式数据
      let resultData = JSON.parse(data);
      // 判断是否存在错误信息，若存在错误信息则表示请求失败
      if (resultData.error) {
        // 返回错误信息
        this.setAssistantMsgContent(resultData.error.message);
        return;
      }
      // 解析获取到的数据
      for (let choice of resultData.choices) {
        let content = choice.delta.content;
        // 检查content，没有直接跳过
        if (content) {
          this.addAssistantMsgContent(content);
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
      this.addAssistantMsgContent(errorMessage);
      this.setGenerating(false);
    }
  };

}

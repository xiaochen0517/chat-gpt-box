import store from "../store/store.js";
import _ from "lodash";

// 请求地址
const API_URL = "https://api.openai.com/v1/chat/completions";
// 请求方式
const REQ_TYPE = "POST";
// 字符解码器
const decoder = new TextDecoder('utf-8');
// stream读取器
let reader = null;
let changeFunc = () => {
};

let data = {
  robotIndex: 0,
  tabIndex: 0,
  content: "",
};

const addUserMessage = () => {
  store.commit("addUserMessage", {
    robotIndex: data.robotIndex,
    tabIndex: data.tabIndex,
    content: data.content,
  });
  changeFunc();
};

const addAssistantMessage = () => {
  store.commit("addAssistantMessage", {
    robotIndex: data.robotIndex,
    tabIndex: data.tabIndex,
  });
  changeFunc();
};

const setAssistantMsgContent = (content) => {
  store.commit("setAssistantMsgContent", {
    robotIndex: data.robotIndex,
    tabIndex: data.tabIndex,
    content: content,
  });
  changeFunc();
};

const addAssistantMsgContent = (content) => {
  store.commit("addAssistantMsgContent", {
    robotIndex: data.robotIndex,
    tabIndex: data.tabIndex,
    content: content,
  });
  changeFunc();
};

const setGenerating = (generating) => {
  console.log("data", data);
  store.commit("setGenerating", {
    robotIndex: data.robotIndex,
    tabIndex: data.tabIndex,
    generating: generating,
  });
};

export const sendRequest = ({robotIndex, tabIndex, content}, change) => {
  if (change != undefined) {
    changeFunc = change;
  }
  // 检查并初始化数据
  checkRequestData(robotIndex, tabIndex, content);
  // 设置内容
  data = {
    robotIndex: robotIndex,
    tabIndex: tabIndex,
    content: content,
  };
  try {
    // 设置当前状态为生成中
    setGenerating(true);
    // 添加用户信息
    addUserMessage();
    const messages = _.cloneDeep(store.state.chatHistory[robotIndex][tabIndex].chat);
    addAssistantMessage();
    // 发送请求
    sendFetch(messages);
  } catch (exception) {
    console.error(exception);
    // 写入错误信息
    setAssistantMsgContent(exception.message);
    // 当前状态为生成完成
    setGenerating(false);
  }
};

const checkRequestData = (robotIndex, tabIndex, content) => {
  // 检查并初始化数据
  if (content.length <= 0) {
    console.error("无信息可发送");
    throw Error("无信息可发送");
  }
  if (robotIndex == undefined || tabIndex == undefined) {
    console.error("无效的索引");
    throw Error("无效的索引");
  }
};

const buildHeaders = () => {
  const apiKey = store.state.apiKey;
  if (apiKey == "" || apiKey.length < 3) {
    throw Error("请输入正确的ApiKey");
  }
  return {
    'Authorization': `Bearer ${store.state.apiKey}`,
    'Content-Type': 'application/json',
  };
};

const buildBodyJson = (messages) => {
  const robotOptions = store.state.robotList[data.robotIndex].options;
  return JSON.stringify({
    messages,
    model: robotOptions.model,
    max_tokens: robotOptions.max_tokens,
    stream: true,
  });
};

const sendFetch = (messages) => {
  const controller = new AbortController();
  fetch(API_URL, {
    method: REQ_TYPE,
    headers: buildHeaders(),
    body: buildBodyJson(messages),
    signal: controller.signal,
  }).then((data) => {
    reader = data.body.getReader();
    reader.read().then(readResponse);
    // 当前状态为生成完成
    setGenerating(false);
  });
};

const readResponse = (result) => {
  if (result.done) {
    console.log("读取完成");
    return;
  }
  // 这是一个 Uint8Array 类型的字节数组，需要进行解码
  let str = decoder.decode(result.value);
  // 有可能获取的一个数据包中有多个独立的块，使用data:进行分割
  let strArr = str.split("data:");
  // 循环解析
  for (let string of strArr) {
    // 跳过空字符串
    if (string.length === 0) {
      continue;
    }
    // 判断是否读取完成
    if (string.trim() == "[DONE]") {
      console.log("读取完成");
      return;
    }
    // 解析返回的json格式数据
    let resultData = JSON.parse(string);
    // 判断是否存在错误信息，若存在错误信息则表示请求失败
    if (resultData.error) {
      // 返回错误信息
      setAssistantMsgContent(resultData.error.message);
      return;
    }
    // 解析获取到的数据
    let choices = resultData.choices;
    for (let choice of choices) {
      let delta = choice.delta;
      // 检查content，没有直接跳过
      if (delta.content) {
        addAssistantMsgContent(delta.content);
      }
    }
  }
  // 继续读取剩余的数据
  reader.read().then(readResponse);
};

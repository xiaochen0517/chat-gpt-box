import store from "../store/store.js";

// 请求地址
const API_URL = "https://api.openai.com/v1/chat/completions";
// 请求方式
const REQ_TYPE = "POST";
// 字符解码器
const decoder = new TextDecoder('utf-8');
// stream读取器
let reader = null;
// 读取回调方法 参数分别为 是否成功、字符串信息、是否结束
let dataReturnFunction = null;

export const request = (messages, dataReturnParam) => {
  dataReturnFunction = dataReturnParam;
  try {
    sendFetch(messages);
  } catch (exception) {
    dataReturnFunction(false, exception.message, true);
  }
};

const buildHeaders = () => {
  if (store.state.apiKey.length < 3) {
    throw Error("请输入正确的ApiKey");
  }
  return {
    'Authorization': `Bearer ${store.state.apiKey}`,
    'Content-Type': 'application/json',
  };
};

const buildBodyJson = (messages) => {
  return JSON.stringify({
    messages,
    model: "gpt-3.5-turbo",
    max_tokens: 2048,
    stream: true
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
  }).catch((error) => {
    console.error(error);
    dataReturnFunction(false, error.message, true);
  });
};

const readResponse = (result) => {
  if (result.done) {
    console.log("读取完成");
    return;
  }
  // 这是一个 Uint8Array 类型的字节数组，需要进行解码
  let str = decoder.decode(result.value);
  // 去除返回内容中的换行符
  str = str.replace(/[\r\n]/g, "");
  // 有可能获取的一个数据包中有多个独立的块，使用data:进行分割
  let strArr = str.split("data:");
  // 循环解析
  for (let string of strArr) {
    // 跳过空字符串
    if (string.length === 0) {
      continue;
    }
    // 去除前后空格
    string = string.trim();
    // 判断是否读取完成
    if (string === "[DONE]") {
      console.log("读取完成");
      return;
    }
    // 解析返回的json格式数据
    let resultData = JSON.parse(string);
    // 判断是否存在错误信息，若存在错误信息则表示请求失败
    if (resultData.error) {
      // 返回错误信息
      dataReturnFunction(false, resultData.error.message, true);
      return;
    }
    // 解析获取到的数据
    let choices = resultData.choices;
    for (let choice of choices) {
      let delta = choice.delta;
      // 检查content，没有直接跳过
      if (delta.content) {
        dataReturnFunction(true, delta.content, false);
      }
    }
  }
  // 继续读取剩余的数据
  reader.read().then(readResponse);
};

export default request;

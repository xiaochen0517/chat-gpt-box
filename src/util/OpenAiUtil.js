import store from "../store/store.js";

const decoder = new TextDecoder('utf-8');
let reader = null;
let dataReturn = null;

export const request = (content, dataReturnParam) => {
  dataReturn = dataReturnParam;
  const messages = [{role: "user", content: content}];
  const controller = new AbortController();
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${store.state.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      model: "gpt-3.5-turbo",
      max_tokens: 2048,
      stream: true
    }),
    signal: controller.signal,
  }).then((data) => {
    reader = data.body.getReader();
    reader.read().then(readResponse);
  }).catch((error) => {
    console.error(error);
  });
};

const readResponse = (result) => {
  if (result.done) {
    console.log("读取完成");
    return;
  }
  // console.log(result.value); // 这是一个 Uint8Array 类型的字节数组
  let str = decoder.decode(result.value);
  // 去除换行符
  str = str.replace(/[\r\n]/g, "");
  // 使用data:进行分割
  let strArr = str.split("data:");
  for (let string of strArr) {
    if (string.length === 0) {
      continue;
    }
    // 去除前后空格
    string = string.trim();
    if (string === "[DONE]") {
      console.log("读取完成");
      return;
    }
    let resultData = JSON.parse(string);
    console.log("解析结果：", resultData);
    if (resultData.error) {
      // 返回错误信息
      dataReturn(false, resultData.error.message, true);
    }
    let choices = resultData.choices;
    for (let choice of choices) {
      let delta = choice.delta;
      if (delta.content) {
        console.log(delta.content);
        dataReturn(true, delta.content, false);
      } else {
        dataReturn(true, "", choice.finish_reason == "stop");
      }
    }
  }
  // 继续读取剩余的数据
  reader.read().then(readResponse);
};

export default request;

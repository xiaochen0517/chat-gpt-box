import {createStore} from "vuex";

const store = createStore({
  state: {
    // 版本号
    version: "0.1.1",
    // 机器人列表
    robotList: [
      {
        name: "TestRobot",
        prompt: "You are a helpful assistant.",
        options: {
          enabled: false,
          apiUrl: "https://api.openai.com/",
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          context_max_message: 1,
          context_max_tokens: 2048,
          response_max_tokens: 0
        }
      },
    ],
    // 聊天记录
    chatHistory: [
      // 指定index机器人的聊天记录，拥有多个tab页
      [
        {
          name: "test-1",
          // 当前是否处于生成中
          generating: false,
          // 指定index tab页的聊天记录
          chat: [{role: "system", content: "You are a helpful assistant."}],
        },
        {
          name: "test-2",
          // 当前是否处于生成中
          generating: false,
          // 指定index tab页的聊天记录
          chat: [{role: "system", content: "You are a helpful assistant."}],
        }
      ],
    ],
    // 软件配置
    config: {
      // 是否为暗模式
      isDarkMode: false,
      // 基础配置
      base: {
        // openai api key
        apiKey: "",
        // 聊天输入框enter键发送消息
        enterSend: true,
        // api请求地址
        apiUrl: "https://api.openai.com/",
        // 模型名称
        model: "gpt-3.5-turbo",
        // 温度
        temperature: 0.7,
        // 上下文消息数量
        context_max_message: 1,
        // 上下文最大token数量
        context_max_tokens: 2048,
        // 响应最大token数量
        response_max_tokens: 0
      },
      // 快捷键配置
      shortcut: {
        // 聚焦到输入框
        focusInput: "ctrl+/",
        // 打开设置窗口
        openSetting: "ctrl+s",
        // 添加tab
        addTab: "ctrl+t",
        // 删除tab
        removeTab: "ctrl+w",
        // 清空当前tab页聊天记录
        cleanTabChat: "ctrl+e",
        // 上一个tab页
        prevTab: "ctrl+left",
        // 下一个tab页
        nextTab: "ctrl+right",
        // 新增机器人
        addRobot: "ctrl+n",
        // 切换机器人
        switchRobot: "ctrl+tab",
        // 上一个机器人
        prevRobot: "ctrl+up",
        // 下一个机器人
        nextRobot: "ctrl+down",
      }
    }
  },
  mutations: {
    // 从本地存储中加载状态
    initState(state) {
      const savedState = localStorage.getItem("vuex");
      if (savedState) {
        this.replaceState(Object.assign(state, JSON.parse(savedState)));
      }
    },
    // 同步修改状态
    setApiKey(state, payload) {
      state.apiKey = payload;
    },
    // 删除机器人
    removeRobot(state, index) {
      state.robotList.splice(index, 1);
      state.chatHistory.splice(index, 1);
    },
    // 添加机器人
    addRobot(state, robot) {
      state.robotList.push(robot);
      state.chatHistory.push([{name: "default", chat: [{role: "system", content: robot.prompt}]}]);
    },
    // 更新机器人
    updateRobot(state, {robotIndex, robot}) {
      // 先删除再添加
      state.robotList.splice(robotIndex, 1, robot);
    },
    // 删除聊天tab页
    removeChatTab(state, {robotIndex, tabIndex}) {
      state.chatHistory[robotIndex].splice(tabIndex, 1);
    },
    // 添加聊天tab页
    addChatTab(state, {robotIndex, tabName}) {
      const robotInfo = state.robotList[robotIndex];
      state.chatHistory[robotIndex].push({
        name: tabName,
        generating: false,
        chat: [{role: "system", content: robotInfo.prompt}]
      });
    },
    cleanTabChat(state, {robotIndex, tabIndex}) {
      // 获取当前tab所属的机器人信息
      const robotInfo = state.robotList[robotIndex];
      // 删除当前tab的所有聊天记录
      state.chatHistory[robotIndex][tabIndex].chat.splice(0);
      // 添加一条机器人提示消息
      state.chatHistory[robotIndex][tabIndex].chat.push({role: "system", content: robotInfo.prompt});
    },
    // 添加新消息
    addChatMsg(state, {chatIndex, tabIndex, message}) {
      state.chatHistory[chatIndex][tabIndex].chat.push(message);
    },
    // 设置指定的content内容
    setChatContent(state, {chatIndex, tabIndex, content}) {
      const msgIndex = state.chatHistory[chatIndex][tabIndex].chat.length - 1;
      state.chatHistory[chatIndex][tabIndex].chat[msgIndex].content += content;
    },
    // 移除指定聊天记录
    removeChatMessage(state, {robotIndex, tabIndex, msgIndex}) {
      state.chatHistory[robotIndex][tabIndex].chat.splice(msgIndex, 1);
    },
    // 清除指定聊天记录
    cleanAllMessage(state, {chatIndex, tabIndex}) {
      const msgCount = state.chatHistory[chatIndex][tabIndex].chat.length;
      state.chatHistory[chatIndex][tabIndex].chat.splice(1, msgCount - 1);
    },
    // 添加一个用户消息
    addUserMessage(state, {robotIndex, tabIndex, content}) {
      state.chatHistory[robotIndex][tabIndex].chat.push({role: "user", content});
    },
    // 添加一个空白的机器人消息
    addAssistantMessage(state, {robotIndex, tabIndex}) {
      state.chatHistory[robotIndex][tabIndex].chat.push({role: "assistant", content: ""});
    },
    // 机器人消息新增
    addAssistantMsgContent(state, {robotIndex, tabIndex, content}) {
      const msgIndex = state.chatHistory[robotIndex][tabIndex].chat.length - 1;
      state.chatHistory[robotIndex][tabIndex].chat[msgIndex].content += content;
    },
    // 设置机器人消息
    setAssistantMsgContent(state, {robotIndex, tabIndex, content}) {
      const msgIndex = state.chatHistory[robotIndex][tabIndex].chat.length - 1;
      state.chatHistory[robotIndex][tabIndex].chat[msgIndex].content = content;
    },
    // 更新消息
    updateMessage(state, {robotIndex, tabIndex, messageIndex, message}) {
      state.chatHistory[robotIndex][tabIndex].chat[messageIndex].role = message.role;
      state.chatHistory[robotIndex][tabIndex].chat[messageIndex].content = message.content;
    },
    // 设置是否正在生成中
    setGenerating(state, {robotIndex, tabIndex, generating}) {
      state.chatHistory[robotIndex][tabIndex].generating = generating;
    },
    // 设置消息发送方式
    setEnterSend(state, enterSend) {
      state.config.enterSend = enterSend;
    },
    // 保存是否为暗模式
    setDarkMode(state, darkMode) {
      console.log("set dark mode = ", darkMode);
      state.config.isDarkMode = darkMode;
    },
    // 保存基础设置
    saveBaseConfig(state, base) {
      state.config.base = base;
    },
    // 保存快捷键设置
    saveShortcutConfig(state, shortcut) {
      state.config.shortcut = shortcut;
    },
  },
  actions: {
    // 保存状态到本地存储
    saveState({state}) {
      localStorage.setItem("vuex", JSON.stringify(state));
    }
  },
  getters: {
    // 获取状态
    getApiKey(state) {
      return state.apiKey;
    }
  }
});

// 每次状态变化时都保存到本地存储
store.subscribe(() => {
  store.dispatch("saveState");
});

// 初始化状态
store.commit("initState");

export default store;

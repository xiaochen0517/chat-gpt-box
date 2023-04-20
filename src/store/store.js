import {createStore} from "vuex";

const store = createStore({
  state: {
    // 状态
    apiKey: "",
    // 机器人列表
    robotList: [
      {prompt: "Test", name: "TestRobot", options: {model: "gpt-3.5-turbo"}},
    ],
    // 聊天记录
    chatHistory: [
      // 指定index机器人的聊天记录，拥有多个tab页
      [
        {
          name: "TestRobot",
          // 指定index tab页的聊天记录
          chat: [{role: "user", content: "你好"}, {role: "robot", content: "你好"}],
        }
      ],
    ],
  },
  mutations: {
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
    // 删除聊天tab页
    removeChatTab(state, chatIndex, tabIndex) {
      state.chatHistory[chatIndex].splice(tabIndex, 1);
    },
    // 添加聊天tab页
    addChatTab(state, chatIndex) {
      const robotInfo = state.robotList[chatIndex];
      state.chatHistory[chatIndex].push({name: "default", chat: [{role: "system", content: robotInfo.prompt}]});
    },
    // 从本地存储中加载状态
    initState(state) {
      const savedState = localStorage.getItem("vuex");
      if (savedState) {
        this.replaceState(Object.assign(state, JSON.parse(savedState)));
      }
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

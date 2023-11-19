import {defineStore} from "pinia";
import {BaseConfig, Robot, RobotTabChatInfo, ShortcutState, StoreRobotOptions} from "@/types/State.ts";
import {ChatMessage} from "@/types/State.ts";

export const useStore = defineStore("store", {
  state: () => {
    return {
      // 版本号
      version: "0.2.3" as string,
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
          } as StoreRobotOptions,
        },
      ] as Array<Robot>,
      // 聊天记录
      chatHistory: [
        // 指定index机器人的聊天记录，拥有多个tab页
        [
          {
            name: "test-1",
            // 当前是否处于生成中
            generating: false,
            // 生成请求的对象
            request: null,
            // 指定index tab页的聊天记录
            chat: [{role: "system", content: "You are a helpful assistant."}],
          },
          {
            name: "test-2",
            // 当前是否处于生成中
            generating: false,
            // 生成请求的对象
            request: null,
            // 指定index tab页的聊天记录
            chat: [{role: "system", content: "You are a helpful assistant."}],
          }
        ],
      ] as Array<Array<RobotTabChatInfo>>,
      // 软件配置
      config: {
        // 是否为暗模式
        isDarkMode: false as boolean,
        // 基础配置
        base: {
          // openai api key
          apiKey: "",
          // 聊天输入框enter键发送消息
          enterSend: true,
          // ctrl+enter或者shift+enter发送消息/换行
          ctrlEnterSend: false,
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
        } as BaseConfig,
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
        } as ShortcutState,
      }
    }
  },
  actions: {
    // 删除机器人
    removeRobot(index: number) {
      this.robotList.splice(index, 1);
      this.chatHistory.splice(index, 1);
    },
    // 添加机器人
    addRobot(robot: Robot) {
      this.robotList.push(robot);
      const defaultChatMessage: ChatMessage = {role: "system", content: robot.prompt};
      const defaultTabChatInfo: RobotTabChatInfo = {
        name: "default",
        generating: false,
        request: null,
        chat: [defaultChatMessage]
      };
      this.chatHistory.push([defaultTabChatInfo]);
    },
    // 更新机器人
    updateRobot(robotIndex: number, robot: Robot) {
      this.robotList[robotIndex] = robot;
    },
    // 删除聊天tab页
    removeChatTab(robotIndex: number, tabIndex: number) {
      this.chatHistory[robotIndex].splice(tabIndex, 1);
    },
    // 添加聊天tab页
    addChatTab(robotIndex: number, tabName: string) {
      const robotInfo = this.robotList[robotIndex];
      this.chatHistory[robotIndex].push({
        name: tabName,
        generating: false,
        request: null,
        chat: [{role: "system", content: robotInfo.prompt}]
      });
    },
    cleanTabChat(robotIndex: number, tabIndex: number) {
      // 获取当前tab所属的机器人信息
      const robotInfo = this.robotList[robotIndex];
      // 删除当前tab的所有聊天记录
      this.chatHistory[robotIndex][tabIndex].chat.splice(0);
      // 添加一条机器人提示消息
      this.chatHistory[robotIndex][tabIndex].chat.push({role: "system", content: robotInfo.prompt});
    },
    // 添加新消息
    addChatMsg(chatIndex: number, tabIndex: number, message: ChatMessage) {
      this.chatHistory[chatIndex][tabIndex].chat.push(message);
    },
    // 设置指定的content内容
    setChatContent(chatIndex: number, tabIndex: number, content: string) {
      const msgIndex = this.chatHistory[chatIndex][tabIndex].chat.length - 1;
      this.chatHistory[chatIndex][tabIndex].chat[msgIndex].content += content;
    },
    // 移除指定聊天记录
    removeChatMessage(robotIndex: number, tabIndex: number, msgIndex: number) {
      this.chatHistory[robotIndex][tabIndex].chat.splice(msgIndex, 1);
    },
    // 清除指定聊天记录
    cleanAllMessage(chatIndex: number, tabIndex: number) {
      const msgCount = this.chatHistory[chatIndex][tabIndex].chat.length;
      this.chatHistory[chatIndex][tabIndex].chat.splice(1, msgCount - 1);
    },
    // 添加一个用户消息
    addUserMessage(robotIndex: number, tabIndex: number, content: string) {
      this.chatHistory[robotIndex][tabIndex].chat.push({role: "user", content});
    },
    // 添加一个空白的机器人消息
    addAssistantMessage(robotIndex: number, tabIndex: number) {
      this.chatHistory[robotIndex][tabIndex].chat.push({role: "assistant", content: ""});
    },
    // 机器人消息新增
    addAssistantMsgContent(robotIndex: number, tabIndex: number, content: string) {
      const msgIndex = this.chatHistory[robotIndex][tabIndex].chat.length - 1;
      this.chatHistory[robotIndex][tabIndex].chat[msgIndex].content += content;
    },
    // 设置机器人消息
    setAssistantMsgContent(robotIndex: number, tabIndex: number, content: string) {
      const msgIndex: number = this.chatHistory[robotIndex][tabIndex].chat.length - 1;
      let lastMsgInfo: ChatMessage = this.chatHistory[robotIndex][tabIndex].chat[msgIndex];
      if (lastMsgInfo.role !== "assistant") {
        lastMsgInfo = {role: "assistant", content: ""};
        this.chatHistory[robotIndex][tabIndex].chat.push(lastMsgInfo);
      }
      lastMsgInfo.content = content;
    },
    // 更新消息
    updateMessage(robotIndex: number, tabIndex: number, messageIndex: number, message: ChatMessage) {
      this.chatHistory[robotIndex][tabIndex].chat[messageIndex].role = message.role;
      this.chatHistory[robotIndex][tabIndex].chat[messageIndex].content = message.content;
    },
    // 设置是否正在生成中
    setGenerating(robotIndex: number, tabIndex: number, generating: boolean) {
      console.log("setGenerating", robotIndex, tabIndex, generating)
      this.chatHistory[robotIndex][tabIndex].generating = generating;
      if (!generating) this.chatHistory[robotIndex][tabIndex].request = null;
    },
    // 保存是否为暗模式
    setDarkMode(darkMode: boolean) {
      this.config.isDarkMode = darkMode;
    },
    // 保存基础设置
    saveBaseConfig(base: BaseConfig) {
      this.config.base = base;
    },
    // 保存快捷键设置
    saveShortcutConfig(shortcut: ShortcutState) {
      this.config.shortcut = shortcut;
    },
    setAllData(data: any) {
      this.version = data.version;
      this.robotList = data.robotList;
      this.chatHistory = data.chatHistory;
      this.config = data.config;
    }
  },
  persist: {
    key: 'state',
  },
});

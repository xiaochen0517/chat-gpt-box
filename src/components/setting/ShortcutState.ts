import {ShortcutState} from "@/types/State.ts";

const shortcutState: ShortcutState = {
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

export default shortcutState;
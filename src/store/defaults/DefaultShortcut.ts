import AppUtil from "@/utils/AppUtil.ts";
import {ShortcutConfig} from "@/types/Store.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";

const DEFAULT_SHORTCUT_WINDOW: ShortcutConfig = {
  focusInput: [KeyMapEnum.CTRL, KeyMapEnum.BACKSLASH],
  openSetting: [KeyMapEnum.CTRL, KeyMapEnum.S],
  addTab: [KeyMapEnum.CTRL, KeyMapEnum.T],
  removeTab: [KeyMapEnum.CTRL, KeyMapEnum.W],
  cleanTabChat: [KeyMapEnum.CTRL, KeyMapEnum.E],
  prevTab: [KeyMapEnum.CTRL, KeyMapEnum.LEFT],
  nextTab: [KeyMapEnum.CTRL, KeyMapEnum.RIGHT],
  addRobot: [KeyMapEnum.CTRL, KeyMapEnum.N],
  switchRobot: [KeyMapEnum.CTRL, KeyMapEnum.TAB],
  prevRobot: [KeyMapEnum.CTRL, KeyMapEnum.UP],
  nextRobot: [KeyMapEnum.CTRL, KeyMapEnum.DOWN],
}

const DEFAULT_SHORTCUT_MAC: ShortcutConfig = {
  focusInput: [KeyMapEnum.META, KeyMapEnum.BACKSLASH],
  openSetting: [KeyMapEnum.META, KeyMapEnum.S],
  addTab: [KeyMapEnum.META, KeyMapEnum.T],
  removeTab: [KeyMapEnum.META, KeyMapEnum.W],
  cleanTabChat: [KeyMapEnum.META, KeyMapEnum.E],
  prevTab: [KeyMapEnum.META, KeyMapEnum.LEFT],
  nextTab: [KeyMapEnum.META, KeyMapEnum.RIGHT],
  addRobot: [KeyMapEnum.META, KeyMapEnum.N],
  switchRobot: [KeyMapEnum.META, KeyMapEnum.TAB],
  prevRobot: [KeyMapEnum.META, KeyMapEnum.UP],
  nextRobot: [KeyMapEnum.META, KeyMapEnum.DOWN],
}

function getShortcutConfig(): ShortcutConfig {
  if (AppUtil.isMac()) {
    return DEFAULT_SHORTCUT_MAC;
  }
  return DEFAULT_SHORTCUT_WINDOW;
}

export const DEFAULT_SHORTCUT = getShortcutConfig();

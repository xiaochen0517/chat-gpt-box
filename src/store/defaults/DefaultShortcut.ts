import AppUtil from "@/utils/AppUtil.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import {ShortcutConfig} from "@/types/chat/BaseConfig.ts";

const DEFAULT_SHORTCUT_WINDOW: ShortcutConfig = {
  focusInput: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_BACKSLASH],
  openSetting: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_S],
  addTab: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_T],
  removeTab: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_W],
  cleanTabChat: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_E],
  prevTab: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_LEFT],
  nextTab: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_RIGHT],
  addRobot: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_N],
  switchRobot: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_TAB],
  prevRobot: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_UP],
  nextRobot: [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_DOWN],
};

const DEFAULT_SHORTCUT_MAC: ShortcutConfig = {
  focusInput: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_BACKSLASH],
  openSetting: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_S],
  addTab: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_T],
  removeTab: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_W],
  cleanTabChat: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_E],
  prevTab: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_LEFT],
  nextTab: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_RIGHT],
  addRobot: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_N],
  switchRobot: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_TAB],
  prevRobot: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_UP],
  nextRobot: [KeyMapEnum.KEY_META, KeyMapEnum.KEY_DOWN],
};

function getShortcutConfig(): ShortcutConfig {
  if (AppUtil.isMac()) {
    return DEFAULT_SHORTCUT_MAC;
  }
  return DEFAULT_SHORTCUT_WINDOW;
}

export const DEFAULT_SHORTCUT = getShortcutConfig();

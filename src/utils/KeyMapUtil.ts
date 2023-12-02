import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {ArrayUtil} from "@/utils/ArrayUtil.ts";
import {ShortcutConfig, ShortcutConfigKey, ShortcutStringConfig} from "@/types/Store.ts";
import _ from "lodash";

export class KeyMapUtil {

  public static getKeyMapEnumListBySorted(KeyMapList: KeyMapEnum[]): KeyMapEnum[] {
    KeyMapList = _.cloneDeep(KeyMapList);
    let modifierKeyList = ["control", "shift", "alt"];
    KeyMapList.sort((firstKey, secondKey) => {
      let firstKeyInModifierKeyListIndex = modifierKeyList.indexOf(firstKey);
      let secondKeyInModifierKeyListIndex = modifierKeyList.indexOf(secondKey);

      let firstKeyIsModifierKey = firstKeyInModifierKeyListIndex >= 0;
      let secondIsModifierKey = secondKeyInModifierKeyListIndex >= 0;

      if (firstKeyIsModifierKey && secondIsModifierKey) {
        return firstKeyInModifierKeyListIndex - secondKeyInModifierKeyListIndex;
      }
      if (firstKeyIsModifierKey) return -1;
      if (secondIsModifierKey) return 1;
      return firstKey.localeCompare(secondKey);
    })
    return KeyMapList;
  }

  public static selectShortcutKeyByKeyMapList(keyMapList: KeyMapEnum[]): string {
    if (!keyMapList || keyMapList.length === 0) throw new Error("keyMapList is null");

    const configStore = useConfigStore();
    let selectKey = "";
    Object.entries(configStore.shortcut).some(([key, valueList]) => {
      if (ArrayUtil.isEqualsListIgnoreOrder(keyMapList, valueList)) {
        selectKey = key;
        return true;
      }
    })
    return selectKey;
  }

  public static formatShortcutKeyMapList2String(keyMapList: KeyMapEnum[] = [], isLowerCase = true, joinCode = "+"): string {
    if (!keyMapList) return "";

    let joinString: string = keyMapList.join(joinCode);
    return isLowerCase ? joinString.toLowerCase() : joinString;
  }

  public static formatShortcutConfig2ShortcutStringConfig(shortcutConfig: ShortcutConfig): ShortcutStringConfig {
    let shortcutStringConfig: Partial<ShortcutStringConfig> = {};
    for (const keyStr in shortcutConfig) {
      const key = keyStr as ShortcutConfigKey;
      shortcutStringConfig[key] = this.formatShortcutKeyMapList2String(shortcutConfig[key]);
    }
    return shortcutStringConfig as ShortcutStringConfig;
  }

  public static formatShortcutKeyMap2ShowCode(code: string) {
    if (code === KeyMapEnum.CTRL) {
      code = "ctrl";
    }
    return code.toUpperCase();
  }
}
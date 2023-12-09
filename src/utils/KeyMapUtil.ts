import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {ArrayUtil} from "@/utils/ArrayUtil.ts";
import _ from "lodash";
import {ShortcutConfig, ShortcutConfigKey, ShortcutStringConfig} from "@/types/chat/BaseConfigTypes.ts";

export class KeyMapUtil {

  public static getKeyMapEnumListBySorted(KeyMapList: KeyMapEnum[]): KeyMapEnum[] {
    KeyMapList = _.cloneDeep(KeyMapList);
    const modifierKeyList: string[] = [KeyMapEnum.KEY_CTRL, KeyMapEnum.KEY_SHIFT, KeyMapEnum.KEY_ALT, KeyMapEnum.KEY_META];
    KeyMapList.sort((firstKey, secondKey) => {
      const firstKeyInModifierKeyListIndex = modifierKeyList.indexOf(firstKey);
      const secondKeyInModifierKeyListIndex = modifierKeyList.indexOf(secondKey);

      const firstKeyIsModifierKey = firstKeyInModifierKeyListIndex >= 0;
      const secondIsModifierKey = secondKeyInModifierKeyListIndex >= 0;

      if (firstKeyIsModifierKey && secondIsModifierKey) {
        return firstKeyInModifierKeyListIndex - secondKeyInModifierKeyListIndex;
      }
      if (firstKeyIsModifierKey) return -1;
      if (secondIsModifierKey) return 1;
      return firstKey.localeCompare(secondKey);
    });
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
    });
    return selectKey;
  }

  public static formatShortcutKeyMapList2String(keyMapList: KeyMapEnum[] = [], isLowerCase = true, joinCode = "+"): string {
    if (!keyMapList) return "";

    const joinString: string = keyMapList.join(joinCode);
    return isLowerCase ? joinString.toLowerCase() : joinString;
  }

  public static formatShortcutConfig2ShortcutStringConfig(shortcutConfig: ShortcutConfig): ShortcutStringConfig {
    const shortcutStringConfig: Partial<ShortcutStringConfig> = {};
    for (const keyStr in shortcutConfig) {
      const key = keyStr as ShortcutConfigKey;
      shortcutStringConfig[key] = this.formatShortcutKeyMapList2String(shortcutConfig[key]);
    }
    return shortcutStringConfig as ShortcutStringConfig;
  }

  public static formatShortcutKeyMap2ShowCode(code: string) {
    if (code === KeyMapEnum.KEY_CTRL) {
      code = "ctrl";
    }
    return code.toUpperCase();
  }
}
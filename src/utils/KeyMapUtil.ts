import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {ArrayUtil} from "@/utils/ArrayUtil.ts";

export class KeyMapUtil {
  static shortcut = useConfigStore().shortcut;

  /**
   * 对快捷键进行排序
   */
  public static sortSaveKeys(keyValues: KeyMapEnum[]): KeyMapEnum[] {
    let sortKeyList = [...keyValues];
    // 优先级排序
    let order = ["control", "shift", "alt", "tab"];
    sortKeyList.sort((a, b) => {
      let aIndex = order.indexOf(a);
      let bIndex = order.indexOf(b);

      let aIncludes = order.includes(a);
      let bIncludes = order.includes(b);

      if (aIncludes && bIncludes) {
        return aIndex - bIndex;
      } else if (aIncludes) {
        return -1;
      } else if (bIncludes) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    })
    return sortKeyList;
  }

  /**
   * 查找重复的 快捷键名称
   * @param keyValues 根据Values查找
   * @returns {string} 重复的快捷键名称
   */
  public static getRepeatKeyName(keyValues: KeyMapEnum[]): string {
    if (!keyValues) {
      throw new Error("keyValues is null");
    }
    let equalsKeyName = "";
    Object.entries(this.shortcut).some(([keyName, values]) => {
      if (ArrayUtil.isEqualsIgnoreOrder(values, keyValues)) {
        equalsKeyName = keyName;
        return true;
      }
    })
    return equalsKeyName;
  }

  /**
   * 根据快捷键名称获取快捷键值, 以字符串形式返回
   * @param keyValues
   */
  public static getKeyValueToString(keyValues:  KeyMapEnum[], combination?: string): string {
    if (!keyValues) return "";

    return keyValues
      .map(key => key.toLowerCase())
      .join(combination || "+");
  }

}
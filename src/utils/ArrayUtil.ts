export class ArrayUtil {
  /**
   * 判断两个数组是否相等，不考虑顺序
   * @param arr1
   * @param arr2
   */
  public static isEqualsIgnoreOrder<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (const item of arr1) {
      if (!arr2.includes(item)) {
        return false;
      }
    }
    return true;
  }
}
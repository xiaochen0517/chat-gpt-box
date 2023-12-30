export default class StrUtil {

  /**
   * @description 检查字符串是否为空
   * @param str
   */
  public static isEmpty(str: string): boolean {
    return str === null || str === undefined || str.trim().length === 0;
  }

  /**
   * @description 检查字符串是否不为空
   * @param str
   */
  public static isNotEmpty(str: string): boolean {
    return !this.isEmpty(str);
  }

  /**
   * @description 检查字符串是否包含空
   * @param str string[]
   */
  public static hasEmpty(...str: string[]): boolean {
    return str.some((s: string): boolean => this.isEmpty(s));
  }

  /**
   * @description 检查字符串是否不包含空
   * @param str string[]
   */
  public static hasNotEmpty(...str: string[]): boolean {
    return !this.hasEmpty(...str);
  }

  /**
   * @description 检查字符串是否与任意一个字符串相等
   * @param str string 需要比较的字符串
   * @param strs string[] 需要比较的字符串
   */
  public static equalsAny(str: string, ...strs: string[]): boolean {
    return strs.some((s: string): boolean => s === str);
  }
}
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
}
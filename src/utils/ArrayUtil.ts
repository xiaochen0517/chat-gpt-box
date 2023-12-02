export class ArrayUtil {

  public static isEqualsListIgnoreOrder<T>(arr1: T[], arr2: T[]): boolean {
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

  public static formatList2LowerCase(list: string[]): string[] {
    return list.map((item) => item.toLowerCase());
  }

  public static formatList2UpperCase(list: string[]): string[] {
    return list.map((item) => item.toUpperCase());
  }
}
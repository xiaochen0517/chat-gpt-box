export class DateUtil {

  public static getCurrentTime(): string {
    const date = new Date();
    return `${date.getFullYear()}-${DateUtil.fillZero(date.getMonth() + 1)}-${DateUtil.fillZero(date.getDate())} ` +
      `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  }

  private static fillZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}

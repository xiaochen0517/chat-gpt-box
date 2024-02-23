export enum Platform {
  Web = "web",
  Tauri = "tauri",
}

export default class AppUtil {

  /**
   * @description 检查当前环境在哪个平台
   */
  public static checkPlatform(): Platform {
    // eslint-disable-next-line
    if (!(window as any).__TAURI__) {
      return Platform.Web;
    }
    return Platform.Tauri;
  }

  /**
   * @description 检查当前环境是否是web
   */
  public static isWeb(): boolean {
    return this.checkPlatform() === Platform.Web;
  }

  /**
   * @description 检查当前环境是否是tauri
   */
  public static isTauri(): boolean {
    return this.checkPlatform() === Platform.Tauri;
  }

  public static isMac(): boolean {
    return navigator.userAgent.indexOf("Mac") >= 0;
  }
}
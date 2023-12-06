import {Capacitor} from "@capacitor/core";

export enum Platform {
  Web = "web",
  Tauri = "tauri",
  Android = "android",
  iOS = "ios",
}

export default class AppUtil {

  /**
   * @description 检查当前环境在哪个平台
   */
  public static checkPlatform(): Platform {
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') {
      return Platform.iOS;
    } else if (platform === 'android') {
      return Platform.Android;
    }
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

  /**
   * @description 检查当前环境是否是mobile
   */
  public static isMobile(): boolean {
    return this.checkPlatform() === Platform.Android || this.checkPlatform() === Platform.iOS;
  }

  public static isMac(): boolean {
    return navigator.userAgent.indexOf('Mac') >= 0;
  }
}
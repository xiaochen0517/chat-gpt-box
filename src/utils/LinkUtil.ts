import {shell} from "@tauri-apps/api";
import AppUtil from "@/utils/AppUtil.ts";

export enum LinkOpenTarget {
  NEW_TAB = "new_tab",
  DEFAULT_BROWSER = "default_browser",
}

export class LinkUtil {
  static openLink(url: string): Promise<LinkOpenTarget> {
    return new Promise<LinkOpenTarget>((resolve, reject) => {
      if (AppUtil.isTauri()) {
        this.openLinkInDefaultBrowser(url)
          .then(() => {
            resolve(LinkOpenTarget.DEFAULT_BROWSER);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        this.openLinkInNewTab(url)
          .then(() => {
            resolve(LinkOpenTarget.NEW_TAB);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  static openLinkInNewTab(url: string): Promise<void> {
    try {
      window.open(url, "_blank");
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static openLinkInDefaultBrowser(url: string) {
    return shell.open(url);
  }
}
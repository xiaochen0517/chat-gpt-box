import {ObjectDirective} from "vue";
import AppUtil from "@/utils/AppUtil.ts";
import {shell} from "@tauri-apps/api";
import {Browser} from "@capacitor/browser";

export const markdownLinkOpenDirective: ObjectDirective<HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeMount(el, _binding) {
    el.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A") {
        const openLinkUrl = (target as HTMLLinkElement).href;
        console.log("Link clicked:", openLinkUrl);
        event.preventDefault();
        if (AppUtil.isTauri()) {
          shell.open(openLinkUrl)
            .then(() => {
              console.log("Link opened in default browser");
            })
            .catch((error) => {
              console.error("Error opening link in default browser:", error);
            });
        } else if (AppUtil.isMobile()){
          Browser.open({url: openLinkUrl})
            .then(() => {
              console.log("Link opened in default browser");
            })
            .catch((error) => {
              console.error("Error opening link in default browser:", error);
            });
        } else {
          // new tab open
          window.open(openLinkUrl, "_blank");
          console.log("Link opened in new tab");
        }
      }
    });
  },
  unmounted(el) {
    // Use stored references to remove event listeners to avoid memory leaks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clickHandler = (el as any).__vueClickEventHandler__;
    el.removeEventListener("click", clickHandler);
  },
};
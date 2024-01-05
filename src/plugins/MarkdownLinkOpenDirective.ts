import {ObjectDirective} from "vue";
import {LinkUtil} from "@/utils/LinkUtil.ts";

export const markdownLinkOpenDirective: ObjectDirective<HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeMount(el, _binding) {
    el.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A") {
        const openLinkUrl = (target as HTMLLinkElement).href;
        console.log("Link clicked:", openLinkUrl);
        event.preventDefault();
        LinkUtil.openLink(openLinkUrl)
          .then((linkOpenTarget) => {
            console.log("Link opened in", linkOpenTarget);
          })
          .catch((error) => {
            console.error("Error opening link:", error);
          });
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
import {ObjectDirective} from "vue";
import {LinkUtil} from "@/utils/LinkUtil.ts";
import logger from "@/utils/logger/Logger.ts";

export const markdownLinkOpenDirective: ObjectDirective<HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeMount(el, _binding) {
    el.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A") {
        const openLinkUrl = (target as HTMLLinkElement).href;
        logger.info("Link clicked:", openLinkUrl);
        event.preventDefault();
        LinkUtil.openLink(openLinkUrl)
          .then((linkOpenTarget) => {
            logger.info("Link opened in", linkOpenTarget);
          })
          .catch((error) => {
            logger.error("Error opening link:", error);
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

import {ref, watch} from 'vue';
import {App} from "@vue/runtime-core";

export default {
  install(app: App) {
    const windowWidth = ref(window.innerWidth);
    const updateWidth = () => {
      windowWidth.value = window.innerWidth;
    };
    window.addEventListener('resize', updateWidth);
    watch(windowWidth, () => {
      if (windowWidth.value < 1024) {
        dialogWidth.value = "90%";
        dialogWidthLg.value = "90%";
      } else {
        dialogWidth.value = "500px";
        dialogWidthLg.value = "70%";
      }
    });
    const dialogWidth = ref("500px");
    const dialogWidthLg = ref("700px");
    app.provide('dialogWidth', dialogWidth);
    app.provide('dialogWidthLg', dialogWidthLg);
  },
};
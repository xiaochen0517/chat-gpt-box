import {computed, ref} from 'vue';
import {App} from "@vue/runtime-core";

export default {
  install(app: App) {
    const windowWidth = ref(window.innerWidth);
    const updateWidth = () => {
      windowWidth.value = window.innerWidth;
    };
    window.addEventListener('resize', updateWidth);
    const dialogWidth = computed(() => {
      if (windowWidth.value < 1024) {
        return "90%";
      } else if (windowWidth.value < 1536) {
        return "500px";
      } else {
        return "400px";
      }
    });
    app.provide('dialogWidth', dialogWidth);
  },
};
import {computed, ref} from 'vue';

export default {
  install(app) {
    const windowWidth = ref(window.innerWidth);
    const updateWidth = () => {
      if ((windowWidth.value < 1024 && window.innerWidth >= 1024) || (windowWidth.value >= 1024 && window.innerWidth < 1024)) {
        windowWidth.value = window.innerWidth;
      }
    };
    window.addEventListener('resize', updateWidth);
    const dialogWidth = computed(() => {
      if (windowWidth.value < 1024) {
        return "90%";
      } else {
        return "50%";
      }
    });
    app.provide('dialogWidth', dialogWidth);
  },
};
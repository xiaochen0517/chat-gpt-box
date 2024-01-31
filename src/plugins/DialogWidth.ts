import {App, ref, watch} from "vue";

export default {
  install(app: App) {
    const windowWidth = ref(window.innerWidth);
    const updateWidth = () => {
      windowWidth.value = window.innerWidth;
    };
    window.addEventListener("resize", updateWidth);
    // when window width changed, update dialog width
    watch(windowWidth, () => {
      setAllDialogWidth(windowWidth.value);
    });
    const setAllDialogWidth = (width: number) => {
      if (width < 1024) {
        dialogWidth.value = "90%";
        dialogWidthLg.value = "90%";
      } else {
        dialogWidth.value = "500px";
        dialogWidthLg.value = "70%";
      }
    };
    const dialogWidth = ref("500px");
    const dialogWidthLg = ref("700px");
    app.provide("dialogWidth", dialogWidth);
    app.provide("dialogWidthLg", dialogWidthLg);
    // first init
    setAllDialogWidth(window.innerWidth);
  },
};
import {createApp} from "vue";
import store from "./store/store.ts";
import router from "./router/router.ts";

import "./assets/style/tailwind.less";
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "./assets/style/global.less";

import App from "./App.vue";
import dialogWidth from "@/plugins/DialogWidth.ts";

let app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus)
app.use(dialogWidth)
app.mount("#app");

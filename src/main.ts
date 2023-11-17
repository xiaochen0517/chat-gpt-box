import {createApp} from "vue";
import router from "./router/router.ts";
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import "./assets/style/tailwind.less";
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "./assets/style/global.less";

import App from "./App.vue";
import dialogWidth from "@/plugins/DialogWidth.ts";

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia)
app.use(router);
app.use(ElementPlus)
app.use(dialogWidth)
app.mount("#app");

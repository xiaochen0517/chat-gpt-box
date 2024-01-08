import {createApp} from "vue";
import router from "./router/Router.ts";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import i18n from "@/i18n/i18n.ts";

import "./assets/style/tailwind.less";
// import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "./assets/style/global.less";

import App from "./App.vue";
import dialogWidth from "@/plugins/DialogWidth.ts";
import AppUtil from "@/utils/AppUtil.ts";

import {markdownLinkOpenDirective} from "@/plugins/MarkdownLinkOpenDirective.ts";


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.directive("link-open", markdownLinkOpenDirective);

app.use(pinia);
app.use(router);
// app.use(ElementPlus);
app.use(dialogWidth);
app.use(i18n);
app.mount("#app");

const platform = AppUtil.checkPlatform();
console.log("Current Platform: " + platform);

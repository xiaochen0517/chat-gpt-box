import {createApp} from "vue";
import store from "./store/store.js";
import router from "./router/router.js";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './assets/style/global.less';
import 'markdown-it-latex/dist/index.css'
import 'highlight.js/styles/monokai.css';

import App from "./App.vue";

let app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus)
app.mount("#app");

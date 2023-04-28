import {createApp} from "vue";
import antDesignVue from 'ant-design-vue';
import store from "./store/store.js";
import router from "./router/router.js";

import 'ant-design-vue/dist/antd.dark.less';
import './assets/style/global.less';
import 'markdown-it-latex/dist/index.css'
import 'highlight.js/styles/monokai.css';

import App from "./App.vue";

let app = createApp(App);
app.use(antDesignVue);
app.use(store);
app.use(router);
app.mount("#app");

import {createApp} from "vue";
import antDesignVue from 'ant-design-vue';
import App from "./App.vue";
import store from "./store/store.js";

import 'ant-design-vue/dist/antd.variable.min.css';
import './assets/style/global.less';

let app = createApp(App);
app.use(antDesignVue);
app.use(store);
app.mount("#app");

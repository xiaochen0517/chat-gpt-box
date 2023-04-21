import {createApp} from "vue";
import antDesignVue from 'ant-design-vue';
import store from "./store/store.js";

import 'ant-design-vue/dist/antd.variable.min.css';
import './assets/style/global.less';

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import highlight from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: highlight,
});

import App from "./App.vue";

let app = createApp(App);
app.use(antDesignVue);
app.use(store);
app.use(VMdPreview);
app.mount("#app");

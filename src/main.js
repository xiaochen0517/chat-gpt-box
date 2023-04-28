import {createApp} from "vue";
import antDesignVue from 'ant-design-vue';
import store from "./store/store.js";
import router from "./router/router.js";

import 'ant-design-vue/dist/antd.dark.less';
import './assets/style/global.less';

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import highlight from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: highlight,
});
VMdPreview.use(createCopyCodePlugin());
VMdPreview.use(createLineNumbertPlugin());
VMdPreview.use(createEmojiPlugin());

import App from "./App.vue";

let app = createApp(App);
app.use(antDesignVue);
app.use(store);
app.use(router);
app.use(VMdPreview);
app.mount("#app");

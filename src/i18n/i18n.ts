import {createI18n} from "vue-i18n";
import en from "../locales/en.json";
import zh_CN from "../locales/zh-CN.json";

// load locale messages
const messages = {
  en,
  "zh-CN": zh_CN,
};

const i18n = createI18n({
  locale: "zh-CN", // 设置默认语言
  fallbackLocale: "en", // 设置备用语言
  messages, // 设置资源文件
});

export default i18n;
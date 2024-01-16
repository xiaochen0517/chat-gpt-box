<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import MarkdownIt from "markdown-it";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import markdownItKatex from "markdown-it-katex";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import markdownItTaskLists from "markdown-it-task-lists";
import "@/assets/style/github-markdown.css";
import hljs from "highlight.js";
import "@/assets/style/highlight-github.less";
import xmlLanguage from "highlight.js/lib/languages/xml";
import {ElMessage} from "element-plus";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;
hljs.registerLanguage("vue", xmlLanguage);

type Props = {
  content: string
}
const props = withDefaults(defineProps<Props>(), {
  content: "# None Content",
});

const configStore = useConfigStore();
const theme = computed(() => configStore.isDarkMode ? "dark" : "light");
watch(() => configStore.isDarkMode, (value) => {
  setMarkdownCodeTheme(value);
});

const setMarkdownCodeTheme = (isDark: boolean) => {
  let markdownCodeDivEls = document.getElementsByClassName("markdown-code-block");
  if (isDark) {
    for (let i = 0; i < markdownCodeDivEls.length; i++) {
      markdownCodeDivEls[i].classList.remove("highlight-light");
      markdownCodeDivEls[i].classList.add("highlight-dark");
    }
  } else {
    for (let i = 0; i < markdownCodeDivEls.length; i++) {
      markdownCodeDivEls[i].classList.remove("highlight-dark");
      markdownCodeDivEls[i].classList.add("highlight-light");
    }
  }
};

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return getCodeBlockHtml(hljs.highlight(str, {language: lang, ignoreIllegals: true}).value, str);
      } catch (__) {
        return getCodeBlockHtml(str, str);
      }
    }
    return getCodeBlockHtml(str, str);
  },
});
const getCodeBlockHtml = (codeHtml: string, originCode: string) => {
  return "<div class=\"markdown-code-block highlight-dark\"><pre class=\"hljs\"><code>" + codeHtml + "</code></pre>" +
      "<div class=\"copy-code-button w-7 h-7 absolute top-2 right-2 flex flex-row items-center justify-center rounded-md hover:bg-neutral-200 hover:dark:bg-neutral-700 cursor-pointer\">" +
      "<i class=\"iconfont icon-file-copy text-black dark:text-white\"></i></div>" +
      "<div class=\"code-origin\" style=\"display: none;\">" + escapeHtml(originCode) + "</div></div>";
};
const escapeHtml = (unsafe: string) => {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
};
md.use(markdownItKatex);
md.use(markdownItTaskLists);

// default render
const defaultRender = md.renderer.rules.fence || function (tokens, idx, options, _env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const code = token.content.trim();
  const lines = code.split("\n");
  let lineNumbersWrapper = "";

  lines.forEach((_line, index) => {
    lineNumbersWrapper += `<span class="line-number">${index + 1}</span>\n`;
  });

  const defaultCodeBlock = defaultRender(tokens, idx, options, env, slf);

  return `<div class="code-block relative">
    <div class="line-numbers">${lineNumbersWrapper}</div>
    ${defaultCodeBlock}
  </div>`;
};

const html = ref("<h1>None Content</h1>");
onMounted(() => {
  html.value = md.render(props.content);
  nextTick(() => {
    setMarkdownCodeTheme(configStore.isDarkMode);
    setCopyCodeButtonClickListener();
  });
});
watch(() => props.content, (value) => {
  html.value = md.render(value);
  nextTick(() => {
    setCopyCodeButtonClickListener();
  });
});

const markdownContainerRefs = ref<HTMLElement | null>(null);
const setCopyCodeButtonClickListener = () => {
  if (!markdownContainerRefs.value) return;
  markdownContainerRefs.value.querySelectorAll(".copy-code-button").forEach(button => {
    button.removeEventListener("click", copyCode);
    button.addEventListener("click", copyCode);
  });
};

function copyCode() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let codeText = (this as Element)?.parentElement?.querySelector(".code-origin")?.textContent;
  if (!codeText) return;
  // copy to clipboard
  navigator.clipboard.writeText(codeText).then(() => {
    console.log("copy success");
    ElMessage.success(t("chat.copy.success"));
  }).catch(() => {
    console.log("copy failed");
    ElMessage.error(t("chat.copy.error"));
  });
}

</script>

<template>
  <article ref="markdownContainerRefs" class="markdown-body" :markdown-theme="theme" v-html="html" v-link-open/>
</template>

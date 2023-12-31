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
        return "<div class=\"markdown-code-block highlight-dark\"><pre class=\"hljs\"><code>" +
            `${hljs.highlight(lang, str, true).value}</code></pre></div>`;
      } catch (__) {
        // ignore
      }
    }
    return "<div class=\"markdown-code-block highlight-dark\"><pre class=\"hljs\"><code>"+str+"</code></pre></div>";
  },
});
md.use(markdownItKatex);
md.use(markdownItTaskLists);
// 保存原始的fence（代码块）渲染规则
const defaultRender = md.renderer.rules.fence || function (tokens, idx, options, _env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
  console.log("tokens", tokens);
  console.log(options);
  console.log("env", env);
  console.log("slf", slf);
  const token = tokens[idx];
  const code = token.content.trim();
  const lines = code.split("\n");
  let lineNumbersWrapper = "";

  lines.forEach((_line, index) => {
    lineNumbersWrapper += `<span class="line-number">${index + 1}</span>\n`;
  });

  const defaultCodeBlock = defaultRender(tokens, idx, options, env, slf);

  return `<div class="code-block">
    <div class="line-numbers">${lineNumbersWrapper}</div>
    ${defaultCodeBlock}
  </div>`;
};

const html = ref("<h1>None Content</h1>");
onMounted(() => {
  html.value = md.render(props.content);
  nextTick(() => {
    setMarkdownCodeTheme(configStore.isDarkMode);
  });
});
watch(() => props.content, (value) => {
  html.value = md.render(value);
});

</script>

<template>
  <div class="p-2">
    <article class="markdown-body" :markdown-theme="theme" v-html="html"/>
  </div>
</template>

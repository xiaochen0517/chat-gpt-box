<script setup>
import MarkdownIt from "markdown-it";
import MarkdownLatex from "markdown-it-latex";
import MarkdownItAbbr from "markdown-it-abbr";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItTasklists from "markdown-it-task-lists";
import MarkdownItTOC from "markdown-it-toc-done-right";
import {onMounted, ref, watch} from "vue";

const props = defineProps({
  content: {
    type: String,
    required: true,
    default: "# None Content"
  },
});

let markdown = null;
const mdHtml = ref('');

onMounted(() => {
  markdown = new MarkdownIt();
  let latexPlugin = MarkdownLatex;
  if (MarkdownLatex.__esModule) {
    latexPlugin = MarkdownLatex.default;
  }
  markdown.use(latexPlugin);
  markdown.use(MarkdownItAbbr);
  markdown.use(MarkdownItAnchor);
  markdown.use(MarkdownItFootnote);
  markdown.use(MarkdownItHighlightjs);
  markdown.use(MarkdownItSub);
  markdown.use(MarkdownItSup);
  markdown.use(MarkdownItTasklists);
  markdown.use(MarkdownItTOC);
  mdHtml.value = markdown.render(props.content);
});

watch(() => props.content, (newVal) => {
  mdHtml.value = markdown.render(newVal);
});

</script>

<template>
  <div v-html="mdHtml"/>
</template>

<style lang="less" scoped>

</style>

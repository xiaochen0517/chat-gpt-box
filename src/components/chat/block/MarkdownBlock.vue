<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useStore} from "@/store/store.ts";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

const props = defineProps({
  content: {
    type: String,
    required: true,
    default: "# None Content"
  },
});

const store = useStore();
const theme = computed(() => store.config.isDarkMode ? 'dark' : 'light');

const id = 'preview-only';
onMounted(() => {
});

</script>

<template>
  <MdPreview
      class="overflow-x-auto"
      :theme="theme"
      :editorId="id"
      :modelValue="props.content"/>
</template>

<style lang="less">
.md-editor-dark {
  --md-color: #fff;
}
.md-editor {
  --md-bk-color: transparent;
}

.md-editor-preview-wrapper {
  padding: 0 .5rem;
}
</style>

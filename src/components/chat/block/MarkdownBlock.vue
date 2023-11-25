<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

type Props = {
  content: string
}
const props = withDefaults(defineProps<Props>(), {
  content: "# None Content",
});

const configStore = useConfigStore();
const theme = computed(() => configStore.isDarkMode ? 'dark' : 'light');

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

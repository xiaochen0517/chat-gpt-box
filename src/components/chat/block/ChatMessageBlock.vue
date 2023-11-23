<script setup lang="ts">
import {CheckOutlined, CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import MarkdownBlock from "@/components/chat/block/MarkdownBlock.vue";
import {ref, watch} from "vue";
import {ChatMessage} from "@/types/Store.ts";

type Props = {
  message: ChatMessage;
  index: number | null;
}
const props = withDefaults(defineProps<Props>(), {
  message: () => ({role: "system", content: "..."}),
  index: null
});

const copySuccess = ref(false);
const copyMessageContent = () => {
  navigator.clipboard.writeText(props.message.content);
  copySuccess.value = true;
  setTimeout(() => {
    copySuccess.value = false;
  }, 1000);
};

</script>

<template>
  <div class="group py-1 pb-2 mt-3">
    <div class="flex flex-row gap-2">
      <div
          v-if="message?.role === 'system'"
          class="w-10 h-10 bg-indigo-500 dark:bg-indigo-600 rounded-md leading-10 text-center flex justify-center items-center select-none">
        <i class="iconfont icon-settings text-2xl leading-10"/>
      </div>
      <div
          v-if="message?.role === 'user'"
          class="w-10 h-10 bg-green-500 dark:bg-green-600 rounded-md leading-10 text-center flex justify-center items-center select-none">
        <i class="iconfont icon-customer text-2xl leading-10"/>
      </div>
      <div
          v-if="message?.role === 'assistant'"
          class="w-10 h-10 bg-sky-500 dark:bg-sky-600 rounded-md leading-10 text-center flex justify-center items-center select-none">
        <img
            src="../../../assets/images/chat_gpt.svg"
            alt="avatar"
            class="w-6 h-6"/>
      </div>
      <div class="flex-1 min-w-0 scroll-auto">
        <MarkdownBlock :content="message?.content"/>
      </div>
    </div>
    <div
        class="flex flex-row gap-1 mt-2 pointer-events-none opacity-100 lg:opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto">
      <button
          class="p-2 rounded-md flex justify-center items-center bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600 hover:text-neutral-700 dark:text-neutral-100 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
          @click="copyMessageContent">
        <CheckOutlined v-if="copySuccess"/>
        <CopyOutlined v-else/>
      </button>
      <button
          class="p-2 rounded-md flex justify-center items-center bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600 hover:text-neutral-700 dark:text-neutral-100 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
          @click="$emit('edit', message, index)">
        <EditOutlined/>
      </button>
      <el-popconfirm
          title="delete message"
          @confirm="$emit('delete', message, index)"
          confirm-button-type="danger"
          confirm-button-text="Delete">
        <template #reference>
          <button
              class="p-2 rounded-md flex justify-center items-center bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600 hover:text-neutral-700 dark:text-neutral-100 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600">
            <DeleteOutlined/>
          </button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<style lang="less">
.github-markdown-body {
  padding: 10px;
}
</style>

<script setup>
import {DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import MarkdownBlock from "@/components/chat/block/MarkdownBlock.vue";

defineProps({
  message: {
    type: Object,
    required: true,
    default: () => {
      return {
        role: "system",
        content: "..."
      };
    }
  },
  index: {
    type: Number,
    required: true,
    default: null
  }
});

</script>

<template>
  <div class="group py-1 pb-2 mt-3 border-b border-slate-500">
    <div class="flex flex-row gap-2">
      <div
          v-if="message.role === 'system'"
          class="w-10 h-10 bg-indigo-500 dark:bg-indigo-600 rounded-md leading-10 text-center flex justify-center items-center">
        <i class="iconfont icon-settings text-2xl leading-10"/>
      </div>
      <div
          v-if="message.role === 'assistant'"
          class="w-10 h-10 bg-sky-500 dark:bg-sky-600 rounded-md leading-10 text-center flex justify-center items-center">
        <img
            src="../../../assets/images/chat_gpt.svg"
            alt="avatar"
            class="w-6 h-6"/>
      </div>
      <div
          v-if="message.role === 'user'"
          class="w-10 h-10 bg-green-500 dark:bg-green-600 rounded-md leading-10 text-center flex justify-center items-center select-none">
        User
      </div>
      <div class="flex-1 min-w-0 whitespace-pre-wrap scroll-auto">
        <MarkdownBlock :content="message.content"/>
      </div>
    </div>
    <div
        class="flex flex-row mt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
      <el-popconfirm
          title="delete message"
          @confirm="$emit('delete', message, index)"
          confirm-button-type="danger"
          confirm-button-text="Delete">
        <template #reference>
          <button
              class="w-10 h-6 mr-1 rounded-md flex justify-center items-center bg-gray-50 hover:bg-gray-200 active:bg-gray-300 text-gray-600 hover:text-gray-700 border border-gray-500 hover:border-gray-600 dark:text-gray-100 dark:bg-transparent dark:border-gray-500 dark:hover:border-gray-600 dark:hover:bg-slate-700 dark:active:bg-slate-600">
            <delete-outlined/>
          </button>
        </template>
      </el-popconfirm>
      <button
          class="w-10 h-6 rounded-md flex justify-center items-center bg-gray-50 hover:bg-gray-200 active:bg-gray-300 text-gray-600 hover:text-gray-700 border border-gray-500 hover:border-gray-600 dark:text-gray-100 dark:bg-transparent dark:border-gray-500 dark:hover:border-gray-600 dark:hover:bg-slate-700 dark:active:bg-slate-600"
          @click="$emit('edit', message, index)">
        <edit-outlined/>
      </button>
    </div>
  </div>
</template>

<style lang="less">
.github-markdown-body {
  padding: 10px;
}
</style>

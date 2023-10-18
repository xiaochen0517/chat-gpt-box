<script setup>
import {SettingOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import MarkdownBlock from "@/components/chat/MarkdownBlock.vue";

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
  <div class="group py-1">
    <div class="flex flex-row gap-2">
      <div class="avatar-img">
        <div v-if="message.role === 'system'" class="w-10 h-10 dark:bg-indigo-600 rounded-md leading-10 text-center">
          <setting-outlined class="text-2xl"/>
        </div>
        <div v-if="message.role === 'assistant'"
             class="w-10 h-10 dark:bg-sky-600 rounded-md leading-10 text-center flex justify-center items-center">
          <img src="../../assets/images/chat_gpt.svg" alt="avatar" class="w-6 h-6"/>
        </div>
        <div v-if="message.role === 'user'"
             class="w-10 h-10 dark:bg-green-600 rounded-md leading-10 text-center flex justify-center items-center">
          User
        </div>
      </div>
      <div class="flex-1 dark:bg-slate-800 rounded-md p-2">
        <MarkdownBlock :content="message.content"/>
      </div>
    </div>
    <div
      class="flex flex-row mt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
      <button class="w-10 h-6 mr-1 border border-slate-500 rounded-md flex justify-center items-center"
              @click="$emit('delete', message, index)">
        <delete-outlined/>
      </button>
      <button class="w-10 h-6 border border-slate-500 rounded-md flex justify-center items-center"
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

<script setup lang="ts">
import {CheckOutlined, CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import MarkdownBlock from "@/components/chat/block/MarkdownBlock.vue";
import {ref, watch} from "vue";
import {ChatMessage, ChatMessageRole} from "@/types/chat/ChatTabInfo.ts";

type Props = {
  message: ChatMessage;
  index: number | null;
  generating: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  message: () => ({role: ChatMessageRole.System, content: "..."}),
  index: null,
  generating: false,
});

const propsGenerating = ref(false);
watch(() => props.generating,
  (value) => {
    propsGenerating.value = value;
  },
  {immediate: true}
);

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
  <div class="py-1 pb-8 pr-2 mt-3 flex flex-row">
    <div
        v-if="message.role === 'system'"
        class="w-10 h-10 bg-indigo-500 dark:bg-indigo-600 rounded-md leading-10 text-center flex justify-center items-center select-none"
    >
      <i class="iconfont icon-settings text-2xl leading-10"/>
    </div>
    <div
        v-if="message.role === 'assistant'"
        class="w-10 h-10 bg-sky-500 dark:bg-sky-600 rounded-md leading-10 text-center flex justify-center items-center select-none"
    >
      <img
          src="../../../assets/images/chat_gpt.svg"
          alt="avatar"
          class="w-6 h-6"
      />
    </div>
    <div
        class="relative mx-4 p-1 rounded-xl dark:bg-neutral-800 flex-1 min-w-0 flex flex-col"
        :class="{'ml-14 user-message-bubble':message.role === 'user', 'mr-14 assistant-message-bubble':message.role !== 'user'}"
    >
      <MarkdownBlock :content="message?.content + (propsGenerating?' ✨':'')"/>
      <div class="flex flex-row gap-1 mt-1">
        <button
            class="p-2 rounded-md flex justify-center items-center bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600 hover:text-neutral-700 dark:text-neutral-100 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600 cursor-pointer"
            @click="copyMessageContent"
        >
          <CheckOutlined v-if="copySuccess"/>
          <CopyOutlined v-else/>
        </button>
        <button
            class="p-2 rounded-md flex justify-center items-center bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600 hover:text-neutral-700 dark:text-neutral-100 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
            @click="$emit('edit', message, index)"
        >
          <EditOutlined/>
        </button>
        <el-popconfirm
            title="delete message"
            @confirm="$emit('delete', message, index)"
            confirm-button-type="danger"
            confirm-button-text="Delete"
        >
          <template #reference>
            <button class="p-2 rounded-md flex justify-center items-center bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600 hover:text-neutral-700 dark:text-neutral-100 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600">
              <DeleteOutlined/>
            </button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div
        v-if="message.role === 'user'"
        class="w-10 h-10 bg-green-500 dark:bg-green-600 rounded-md leading-10 text-center flex justify-center items-center select-none"
    >
      <i class="iconfont icon-customer text-2xl leading-10"/>
    </div>
  </div>
</template>

<style lang="less">
.github-markdown-body {
  padding: 10px;
}

.user-message-bubble::before {
  content: "";
  position: absolute;
  top: 0.875rem;
  right: -1rem;
  width: 0;
  height: 0;
  border: 0.5rem solid transparent;
  @apply dark:border-l-neutral-800;
}

.assistant-message-bubble::before {
  content: "";
  position: absolute;
  top: 0.875rem;
  left: -1rem;
  width: 0;
  height: 0;
  border: 0.5rem solid transparent;
  @apply dark:border-r-neutral-800;
}
</style>

<script setup lang="ts">
import {CheckOutlined, CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import MessageMarkdownComponent from "@/components/chat/block/MessageMarkdownComponent.vue";
import {ref} from "vue";
import {ChatMessage, ChatMessageRole} from "@/types/chat/ChatTabInfo.ts";
import {Avatar, IAvatarProps} from "vue3-avataaars";

type Props = {
  message: ChatMessage;
  index: number | null;
  generating: boolean;
  showRefresh?: boolean;
  avatar: IAvatarProps;
}
const props = withDefaults(defineProps<Props>(), {
  message: () => ({role: ChatMessageRole.System, content: "..."}),
  index: null,
  generating: false,
  showRefresh: false,
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
  <div class="group p-3" :class="{'bg-[#d4d4d48a] dark:bg-[#27272afa]': message.role === 'user', 'bg-[#e5e5e56a] dark:bg-[#27272a7a]': message.role !== 'user'}">
    <div class="flex flex-row gap-2">
      <div
          v-if="message.role === 'system'"
          class="w-10 h-10 bg-indigo-500 dark:bg-indigo-600 rounded-md leading-10 text-center flex justify-center items-center select-none"
      >
        <i class="iconfont icon-settings text-2xl leading-10 text-white"/>
      </div>
      <div
          v-if="message.role === 'user'"
          class="w-10 h-10 bg-green-500 dark:bg-green-600 rounded-md leading-10 text-center flex justify-center items-center select-none"
      >
        <i class="iconfont icon-customer text-2xl leading-10 text-white"/>
      </div>
      <div
          v-if="message.role === 'assistant'"
          class="w-10 h-10 bg-sky-500 dark:bg-sky-600 rounded-md overflow-hidden flex flex-row justify-center"
      >
        <Avatar class="mt-1" v-bind="avatar"/>
      </div>
      <div class="pl-2 flex-1 min-w-0 scroll-auto">
        <MessageMarkdownComponent :content="message?.content + (props.generating?' ✨':'')"/>
      </div>
    </div>
    <div class="flex flex-row gap-1 mt-2 ml-12 pointer-events-none opacity-100 3xl:opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto">
      <button
          class="p-2 rounded-md flex justify-center items-center bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-600 hover:text-neutral-700 dark:text-neutral-100 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
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
      <button
          v-if="props.showRefresh"
          class="p-2 rounded-md flex flex-row items-center bg-gray-200 hover:bg-neutral-300 active:bg-neutral-400 text-neutral-600 hover:text-neutral-700 dark:text-neutral-100 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
          @click="$emit('regenerating')"
      >
        <i class="iconfont icon-reload w-4 h-4 mb-0.5"/>
      </button>
    </div>
  </div>
</template>

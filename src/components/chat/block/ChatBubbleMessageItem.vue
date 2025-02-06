<script setup lang="ts">
import {EditOutlined} from "@ant-design/icons-vue";
import MessageMarkdownComponent from "@/components/chat/block/MessageMarkdownComponent.vue";
import {ref} from "vue";
import {ChatMessageRole, ChatTabMessage} from "@/types/chat/ChatTabInfo.ts";
import {Avatar, IAvatarProps} from "vue3-avataaars";
import ChatMessageControlComponent from "@/components/chat/block/ChatMessageControlComponent.vue";
import ReasoningMessageComponet from "@/components/chat/block/ReasoningMessageComponet.vue";

type Props = {
  message: ChatTabMessage;
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
  <div class="py-1 pb-8 pr-2 mt-3 flex flex-row">
    <!-- 左侧头像 -->
    <div
        v-if="message.role === 'system'"
        class="w-10 h-10 bg-indigo-500 dark:bg-indigo-600 rounded-md leading-10 text-center flex justify-center items-center select-none"
    >
      <i class="iconfont icon-settings text-2xl leading-10 text-white"/>
    </div>
    <div
        v-if="message.role === 'assistant'"
        class="w-10 h-10 bg-sky-500 dark:bg-sky-600 rounded-md overflow-hidden flex flex-row justify-center"
    >
      <Avatar class="mt-1" v-bind="avatar"/>
    </div>
    <!-- 消息区域 -->
    <div
        class="flex-1 group relative mx-4 rounded-2xl min-w-0 flex"
        :class="{'ml-14 flex-row':message.role === 'user', 'mr-14 flex-col':message.role !== 'user'}"
    >
      <button
          v-if="message.role === 'user'"
          class="ml-auto mt-1 h-fit opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 rounded-full p-3 mr-2 flex justify-center items-center text-lg hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 dark:bg-opacity-20"
          @click="$emit('edit', message, index)"
      >
        <EditOutlined/>
      </button>
      <ReasoningMessageComponet
          v-if="!!message && !!message.reasoningContent && message.reasoningContent.length > 0"
          class="mb-2"
          :content="message.reasoningContent"
      />
      <MessageMarkdownComponent
          v-if="message.role !== 'user'"
          :content="message?.content + (props.generating?' ✨':'')"
      />
      <div
          v-if="message.role === 'user'"
          class="py-3 px-6 rounded-3xl bg-neutral-200 dark:bg-neutral-700 dark:bg-opacity-60 text-base break-words whitespace-pre-wrap"
      >
        {{ message?.content + (props.generating ? " ✨" : "") }}
      </div>
      <ChatMessageControlComponent
          v-if="message.role !== 'user'"
          :role="message.role"
          :copySuccess="copySuccess"
          :showRefresh="props.showRefresh"
          :generating="props.generating"
          @copy="copyMessageContent"
          @edit="$emit('edit', message, index)"
          @delete="$emit('delete', message, index)"
          @regenerating="$emit('regenerating')"
      />
    </div>
    <!-- 右侧头像 -->
    <div
        v-if="message.role === 'user'"
        class="w-10 h-10 bg-green-500 dark:bg-green-600 rounded-md leading-10 text-center flex justify-center items-center select-none"
    >
      <i class="iconfont icon-customer text-2xl leading-10 text-white"/>
    </div>
  </div>
</template>

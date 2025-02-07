<script setup lang="ts">
import MessageMarkdownComponent from "@/components/chat/block/MessageMarkdownComponent.vue";
import {ref} from "vue";
import {ChatMessageRole, ChatTabMessage} from "@/types/chat/ChatTabInfo.ts";
import {Avatar, IAvatarProps} from "vue3-avataaars";
import ChatMessageControlComponent from "@/components/chat/block/ChatMessageControlComponent.vue";
import ChatMessageControlButton from "@/components/base/button/ChatMessageControlButton.vue";

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
  <div
      class="group p-3 bg-opacity-40 dark:bg-opacity-60"
      :class="{'bg-neutral-100 dark:bg-neutral-900 rounded-2xl': message.role === 'user'}"
  >
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
      <div class="pl-2 flex-1 min-w-0">
        <MessageMarkdownComponent :content="message?.content + (props.generating?' ✨':'')"/>
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
        <ChatMessageControlButton
            v-else
            class="mt-4"
            icon="icon-edit"
            tooltip="Edit"
            @click="$emit('edit', message, index)"
        />
      </div>
    </div>
  </div>
</template>

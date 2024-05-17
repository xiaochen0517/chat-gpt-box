<script setup lang="ts">
import {computed, ref} from "vue";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import EditMessageDialog from "../dialog/EditMessageDialog.vue";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {ChatMessage} from "@/types/chat/ChatTabInfo.ts";
import ChatNormalMessageItem from "@/components/chat/block/ChatNormalMessageItem.vue";
import ChatBubbleMessageItem from "@/components/chat/block/ChatBubbleMessageItem.vue";
import {AvatarUtil} from "@/utils/AvatarUtil.ts";

const chatTabsStore = useChatTabsStore();
const configStore = useConfigStore();

const bubbleMessage = computed(() => configStore.baseConfig.bubbleMessage);

type Props = {
  chatInfo: ChatInfo | null,
  tabIndex: number
}
const props = withDefaults(defineProps<Props>(), {
  chatInfo: null,
  tabIndex: 0,
});

const chatTabInfo = computed(() => {
  if (!props.chatInfo) return null;
  return chatTabsStore.chatTabs[props.chatInfo.id][props.tabIndex];
});
const avatarProps = computed(() => {
  if (!props.chatInfo) return AvatarUtil.getDefaultAvatar();
  return AvatarUtil.initDefaultAvatar(props.chatInfo.avatar);
});

const deleteMessage = (_message: ChatMessage, index: number) => {
  if (!props.chatInfo) return;
  // stop generating if the last message is delete
  if (chatTabInfo.value && chatTabInfo.value.generating && index === chatTabInfo.value.chat.length - 1) {
    chatTabInfo.value.request?.cancel();
    chatTabsStore.setGenerating(props.chatInfo.id, props.tabIndex, false);
  }
  chatTabsStore.removeChatMessage(props.chatInfo.id, props.tabIndex, index);
};

const editMessageDialogRefs = ref<InstanceType<typeof EditMessageDialog> | null>(null);
const editMessage = (message: ChatMessage, index: number) => {
  if (!editMessageDialogRefs.value || !props.chatInfo) return;
  editMessageDialogRefs.value.show(message, props.chatInfo.id, props.tabIndex, index);
};

const getGenerating = (index: number) => {
  if (!chatTabInfo.value) return false;
  return chatTabInfo.value.generating && index === chatTabInfo.value.chat.length - 1;
};
const getShowRefresh = (index: number) => {
  if (!chatTabInfo.value) return false;
  const lastChatIndex = chatTabInfo.value.chat.length - 1;
  return index === lastChatIndex && chatTabInfo.value.chat[lastChatIndex].role === "assistant";
};
</script>

<template>
  <div class="w-full">
    <template v-if="!bubbleMessage">
      <ChatNormalMessageItem
          v-for="(chatMessage, index) in chatTabInfo?.chat"
          :key="index"
          :index="index"
          :message="chatMessage"
          :generating="getGenerating(index as number)"
          :options="chatInfo?.options"
          :show-refresh="getShowRefresh(index as number)"
          :avatar="avatarProps"
          @delete="deleteMessage"
          @edit="editMessage"
          @regenerating="$emit('regenerating')"
      />
    </template>
    <template v-else>
      <ChatBubbleMessageItem
          v-for="(chatMessage, index) in chatTabInfo?.chat"
          :key="index"
          :index="index"
          :message="chatMessage"
          :generating="getGenerating(index as number)"
          :options="chatInfo?.options"
          :show-refresh="getShowRefresh(index as number)"
          :avatar="avatarProps"
          @delete="deleteMessage"
          @edit="editMessage"
          @regenerating="$emit('regenerating')"
      />
    </template>
    <EditMessageDialog ref="editMessageDialogRefs"/>
  </div>
</template>

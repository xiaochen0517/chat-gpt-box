<script setup lang="ts">
import {computed, ref, watch} from "vue";
import ChatMessageBlock from "./ChatMessageBlock.vue";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import EditMessageDialog from "../dialog/EditMessageDialog.vue";
import {ChatInfo, ChatMessage} from "@/types/Store.ts";

const chatTabsStore = useChatTabsStore();

type Props = {
  chatInfo: ChatInfo | null,
  tabIndex: number
}
const props = withDefaults(defineProps<Props>(), {
  chatInfo: null,
  tabIndex: 0,
});

const propsChatInfo = ref<ChatInfo | null>(props.chatInfo);
watch(
  () => props.chatInfo,
  (value) => {
    propsChatInfo.value = value;
  }
);

const chatTabInfo = computed(() => {
  if (!propsChatInfo.value) return null;
  return chatTabsStore.chatTabs[propsChatInfo.value.id][props.tabIndex];
});

const deleteMessage = (_message: ChatMessage, index: number) => {
  if (!propsChatInfo.value) return;
  chatTabsStore.removeChatMessage(propsChatInfo.value.id, props.tabIndex, index);
};

const editMessageDialogRefs = ref<InstanceType<typeof EditMessageDialog> | null>(null);
const editMessage = (_message: ChatMessage, index: number) => {
  if (!editMessageDialogRefs.value || !propsChatInfo.value) return;
  editMessageDialogRefs.value.show(propsChatInfo.value.id, props.tabIndex, index);
};

const getGenerating = (index: number) => {
  if (!chatTabInfo.value) return false;
  return chatTabInfo.value.generating && index === chatTabInfo.value.chat.length - 1;
};
</script>

<template>
  <div>
    <ChatMessageBlock
        v-for="(chatMessage, index) in chatTabInfo?.chat"
        :key="index"
        :index="index"
        :message="chatMessage"
        :generating="getGenerating(index as number)"
        :options="propsChatInfo?.options"
        @delete="deleteMessage"
        @edit="editMessage"
    />
    <EditMessageDialog ref="editMessageDialogRefs"/>
  </div>
</template>

<script setup lang="ts">
import {computed, PropType, ref, watch} from "vue";
import ChatMessageBlock from "./ChatMessageBlock.vue";
import {useChatTabsStore} from "@/store/ChatTabs.ts";
import EditMessageDialog from "../dialog/EditMessageDialog.vue";
import {ChatInfo, ChatMessage} from "@/types/Store.ts";

const chatTabsStore = useChatTabsStore();

const props = defineProps({
  chatInfo: {
    type: Object as PropType<ChatInfo | null>,
    default: 0
  },
  tabIndex: {
    type: Number,
    default: 0
  }
});

const propsChatInfo = ref<ChatInfo | null>(props.chatInfo);
watch(
    () => props.chatInfo,
    (value) => {
      propsChatInfo.value = value;
    }
);

const msgList = computed(() => {
  if (!propsChatInfo.value) return [];
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

</script>

<template>
  <div>
    <ChatMessageBlock
        v-for="(item, index) in msgList"
        :key="index"
        :index="index"
        :message="item"
        @delete="deleteMessage"
        @edit="editMessage"
        :options="propsChatInfo?.options"/>
    <EditMessageDialog ref="editMessageDialogRefs"/>
  </div>
</template>

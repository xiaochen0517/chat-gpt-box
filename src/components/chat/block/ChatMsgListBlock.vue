<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";
import ChatMessageBlock from "./ChatMessageBlock.vue";
import {useStore} from "@/store/store.ts";
import EditMessageDialog from "../dialog/EditMessageDialog.vue";
import {ChatMessage} from "@/types/State.ts";

const store = useStore();

const props = defineProps({
  robotIndex: {
    type: Number,
    default: 0
  },
  tabIndex: {
    type: Number,
    default: 0
  }
});

const msgList = computed(() => store.chatHistory[props.robotIndex][props.tabIndex].chat);
onMounted(() => {
});

onUnmounted(() => {
});

const deleteMessage = (_message: ChatMessage, index: number) => {
  store.removeChatMessage(props.robotIndex, props.tabIndex, index);
};

const editMessageDialogRefs = ref<InstanceType<typeof EditMessageDialog> | null>(null);
const editMessage = (_message: ChatMessage, index: number) => {
  if (!editMessageDialogRefs.value) {
    return;
  }
  editMessageDialogRefs.value.show(props.robotIndex, props.tabIndex, index);
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
        :options="store.robotList[robotIndex].options"/>
    <EditMessageDialog ref="editMessageDialogRefs"/>
  </div>
</template>

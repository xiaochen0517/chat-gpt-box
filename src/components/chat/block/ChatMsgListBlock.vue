<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";
import ChatMessageBlock from "./ChatMessageBlock.vue";
import {useStore} from "vuex";
import EditMessageDialog from "../dialog/EditMessageDialog.vue";
import {ChatMessage} from "gpt-tokenizer/esm/GptEncoding";

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

const msgList = computed(() => store.state.chatHistory[props.robotIndex][props.tabIndex].chat);
onMounted(() => {
});

onUnmounted(() => {
});

const deleteMessage = (_message: ChatMessage, index: number) => {
  store.commit("removeChatMessage", {
    robotIndex: props.robotIndex,
    tabIndex: props.tabIndex,
    msgIndex: index
  });
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
        :options="store.state.robotList[robotIndex].options"/>
    <EditMessageDialog ref="editMessageDialogRefs"/>
  </div>
</template>

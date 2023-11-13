<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import ChatMessageBlock from "./ChatMessageBlock.vue";
import {useStore} from "vuex";
import EditMessageDialog from "../dialog/EditMessageDialog.vue";

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

const deleteMessage = (message, index) => {
  store.commit("removeChatMessage", {
    robotIndex: props.robotIndex,
    tabIndex: props.tabIndex,
    msgIndex: index
  });
};

const editMessageDialogRefs = ref(null);
const editMessage = (message, index) => {
  if (editMessageDialogRefs.value) {
    editMessageDialogRefs.value.show(props.robotIndex, props.tabIndex, index);
  }
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

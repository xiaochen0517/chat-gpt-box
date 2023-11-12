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
const robotOptions = computed(() => store.state.robotList[props.robotIndex].options);
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
  <div class="mt-16">
    <div
        v-if="robotOptions?.enabled"
        class="flex flex-row">
      <div class="border border-gray-700 rounded px-2 py-1 dark:bg-amber-600 text-sm font-bold select-none">
        <i class="iconfont icon-settings font-normal"/>
        {{ robotOptions.model?.toUpperCase() }}
      </div>
    </div>
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

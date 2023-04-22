<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import ChatMessageBlock from "./ChatMessageBlock.vue";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import {useStore} from "vuex";

const store = useStore();

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

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
let bScroll = null;
onMounted(() => {
  bScroll = createBScroll();
  scrollToBottom();
});
const BScrollWrapperRefs = ref(null);
const createBScroll = () => {
  return new BScroll(BScrollWrapperRefs.value, {
    disableMouse: true,
    disableTouch: false,
    bounce: false,
    scrollY: true,
    scrollbar: true,
    mouseWheel: {
      speed: 20,
      invert: false,
      easeTime: 300
    }
  });
};

onUnmounted(() => {
  console.log("onUnmounted");
  if (bScroll) {
    bScroll.destroy();
  }
});

const deleteMsg = (message, index) => {
  store.commit("removeChatMessage", {
    robotIndex: props.robotIndex,
    tabIndex: props.tabIndex,
    msgIndex: index
  });
};

const scrollToBottom = () => {
  if (bScroll == null) {
    return;
  }
  bScroll.refresh();
  bScroll.scrollTo(0, bScroll.maxScrollY, 300);
};

defineExpose({
  scrollToBottom
});

</script>

<template>
  <div ref="BScrollWrapperRefs" class="chat-msg-list-block">
    <div class="scroll-content">
      <ChatMessageBlock v-for="(item, index) in msgList" :key="index" :index="index" :message="item"
                        @delete="deleteMsg"/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-msg-list-block {
  width: 100%;
  overflow: hidden;
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 130px;
}
</style>

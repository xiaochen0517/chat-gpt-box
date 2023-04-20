<script setup>
import {computed, ref, onMounted, onUnmounted} from "vue";
import BScroll from '@better-scroll/core';
import ChatInputBlock from "./ChatInputBlock.vue";
import {request} from "../util/OpenAiUtil.js";
import {useStore} from "vuex";

const chatBoxScrollBoxRefs = ref(null);
let bScroll = null;
onMounted(() => {
  console.log("chatBoxScrollBoxRefs", chatBoxScrollBoxRefs.value);
  bScroll = new BScroll(chatBoxScrollBoxRefs.value, {
    disableMouse: true,
    disableTouch: false,
    mouseWheel: true,
    bounce: false,
    scrollY: true,
  });
});

onUnmounted(() => {
  if (bScroll) {
    bScroll.destroy();
  }
});

const chatBoxTitle = ref("聊天机器人");
const chatHistoryIndex = ref(0);
const activeTabIndex = ref(0);
const chatTabList = computed(() => {
  return store.state.chatHistory[chatHistoryIndex.value];
});

const changeRobot = (index, item) => {
  // 修改机器人
  chatBoxTitle.value = item.name;
  chatHistoryIndex.value = index;
  activeTabIndex.value = 0;
};

const chatBoxContent = ref("");

const chatMsgDone = ref(true);

const commitContent = (content) => {
  console.log(content);
  chatBoxContent.value = "";
  chatMsgDone.value = false;
  request(content, (success, data, done) => {
    if (success) {
      chatBoxContent.value += data;
      chatMsgDone.value = done;
    } else {
      chatBoxContent.value = data;
      chatMsgDone.value = true;
    }
  });
};

const store = useStore();

const onEdit = (targetKey, action) => {
  console.log(targetKey, action);
  if (action === "remove") {
    store.commit("removeChatTab", chatHistoryIndex.value, activeTabIndex.value);
  } else if (action === "add") {
    store.commit("addChatTab", chatHistoryIndex.value);
  }
};

defineExpose({
  changeRobot
});

</script>

<template>
  <div class="chat-box-block flex-column">
    <div class="chat-box-title">{{ chatBoxTitle }}</div>
    <div ref="chatBoxScrollBoxRefs" class="chat-box-content">
      <a-tabs v-model:activeKey="activeTabIndex" type="editable-card" @edit="onEdit" size="small">
        <a-tab-pane v-for="(chatTab, chatTabIndex) in chatTabList" :key="chatTabIndex" :tab="chatTab.name">
          <div v-for="(item, index) in chatTab.chat" :key="index" class="message-item flex-row">
            <div class="avatar-img">
              <img src="https://avatars.githubusercontent.com/u/15976103?v=4" alt="avatar"/>
            </div>
            <div class="message-content">{{ item.content }}</div>
          </div>
        </a-tab-pane>
      </a-tabs>
      <p>{{ chatMsgDone }}</p>
    </div>
    <ChatInputBlock @commit="commitContent"/>
  </div>
</template>

<style lang="less" scoped>
.chat-box-block {
  padding: 10px;
  margin-right: 10px;

  .chat-box-title {
    font-size: 18px;
    color: black;
    font-weight: bold;
    line-height: 32px;
    padding: 0 10px;
  }

  .chat-box-content {
    flex: 1;
    padding: 10px 0;

    .message-item {
      margin-bottom: 10px;

      .avatar-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 5px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .message-content {
        flex: 1;
        font-size: 14px;
      }
    }
  }
}
</style>

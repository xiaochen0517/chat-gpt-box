<script setup>
import {computed, ref, onMounted, onUnmounted, nextTick} from "vue";
import ChatInputBlock from "./ChatInputBlock.vue";
import {request} from "../util/OpenAiUtil.js";
import {useStore} from "vuex";
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ScrollBar from '@better-scroll/scroll-bar';
import ChatMessageBlock from "./chat/ChatMessageBlock.vue";

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

const store = useStore();
const chatBoxScrollBoxRefs = ref([]);
let bScroll = null;
onMounted(() => {
  console.log("refs", chatBoxScrollBoxRefs.value);
  bScroll = createBScroll(`.tab-scroll-wrapper-${activeTabIndex.value}`);
});
const createBScroll = (refs) => {
  if (bScroll != null) {
    bScroll = null;
  }
  return new BScroll(refs, {
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
  if (bScroll) {
    bScroll.destroy();
  }
});
const chatTabChange = (index) => {
  nextTick(() => {
    bScroll = createBScroll(`.tab-scroll-wrapper-${index}`);
  });
};

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

const chatMsgDone = ref(true);


const addUserMessage = (content) => {
  store.commit("addChatMsg", {
    chatIndex: chatHistoryIndex.value,
    tabIndex: activeTabIndex.value,
    message: {
      role: "user",
      content: content,
    }
  });
};
const addRobotMessage = () => {
  store.commit("addChatMsg", {
    chatIndex: chatHistoryIndex.value,
    tabIndex: activeTabIndex.value,
    message: {
      role: "assistant",
      content: "",
    }
  });
};

const refreshAndScrollBottom = () => {
  nextTick(() => {
    if (bScroll) {
      // 刷新滚动组件
      bScroll.refresh();
      // 将滚动区域滚动到底部
      bScroll.scrollTo(0, bScroll.maxScrollY, 300);
    }
  });
};

const addMessageContent = (data) => {
  store.commit("setChatContent", {
    chatIndex: chatHistoryIndex.value,
    tabIndex: activeTabIndex.value,
    content: data,
  });
};

const openaiResultFunction = (success, data, done) => {
  console.log("request", success, data, done);
  refreshAndScrollBottom();
  addMessageContent(data);
  chatMsgDone.value = done;
};
const commitContent = (content) => {
  chatMsgDone.value = false;
  // 添加新用户消息
  addUserMessage(content);
  // 添加新ai消息
  addRobotMessage();
  // 刷新并滚动到底部
  refreshAndScrollBottom();
  request(chatTabList.value[activeTabIndex.value].chat, openaiResultFunction);
};

const onEdit = (targetKey, action) => {
  console.log(targetKey, action);
  if (action === "remove") {
    store.commit("removeChatTab", chatHistoryIndex.value, activeTabIndex.value);
  } else if (action === "add") {
    store.commit("addChatTab", chatHistoryIndex.value);
  }
};

const deleteMessageClick = (message, index) => {
  store.commit("removeChatMessage", {
    chatIndex: chatHistoryIndex.value,
    tabIndex: activeTabIndex.value,
    msgIndex: index,
  });
};

const cleanAllMessage = () => {
  store.commit("cleanAllMessage", {
    chatIndex: chatHistoryIndex.value,
    tabIndex: activeTabIndex.value,
  });
  refreshAndScrollBottom();
};

defineExpose({
  changeRobot
});

</script>

<template>
  <div class="chat-box-block flex-column">
    <div class="chat-top-bar flex-row">
      <div class="chat-box-title" @click="test">{{ chatBoxTitle }}</div>
      <a-button type="primary" size="small" @click="cleanAllMessage">清除所有消息</a-button>
      <a-button type="primary" size="small" @click="refreshAndScrollBottom">滚动到底部</a-button>
    </div>
    <div class="chat-box-content">
      <a-tabs class="chat-scroll-content" v-model:activeKey="activeTabIndex" type="editable-card" @edit="onEdit"
              size="small" @change="chatTabChange">
        <a-tab-pane v-for="(chatTab, chatTabIndex) in chatTabList" :key="chatTabIndex" class="tab-scroll-wrapper"
                    :class="'tab-scroll-wrapper-'+chatTabIndex" :tab="chatTab.name">
          <div class="scroll-content">
            <ChatMessageBlock v-for="(item, index) in chatTab.chat" :key="index" :message="item" :index="index"
                              @delete="deleteMessageClick"/>
          </div>
        </a-tab-pane>
      </a-tabs>
      <p>{{ chatMsgDone }}</p>
    </div>
    <ChatInputBlock class="chat-input-block" @commit="commitContent"/>
  </div>
</template>

<style lang="less" scoped>
.chat-box-block {
  max-height: 100%;
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
    position: relative;

    .tab-scroll-wrapper {
      height: 100%;
      position: absolute;
      top: 40px;
      left: 0;
      overflow: hidden;

      .scroll-content {
        padding-bottom: 100px;
      }
    }
  }
}
</style>

<script setup>
import {computed, ref, onMounted, onUnmounted} from "vue";
import ChatInputBlock from "./ChatInputBlock.vue";
import {request} from "../util/OpenAiUtil.js";
import {useStore} from "vuex";
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ScrollBar from '@better-scroll/scroll-bar';
import {SettingOutlined} from "@ant-design/icons-vue";

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

const store = useStore();
const chatBoxScrollBoxRefs = ref(null);
let bScroll = null;
onMounted(() => {
  console.log("chatBoxScrollBoxRefs", chatBoxScrollBoxRefs.value);
  bScroll = new BScroll(chatBoxScrollBoxRefs.value, {
    disableMouse: false,
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

const chatMsgDone = ref(true);
const commitContent = (content) => {
  console.log(content);
  // 添加新用户消息
  console.log("addChatMsg", chatHistoryIndex.value, activeTabIndex.value);
  store.commit("addChatMsg", {
    chatIndex: chatHistoryIndex.value,
    tabIndex: activeTabIndex.value,
    message: {
      role: "user",
      content: content,
    }
  });
  // 添加新ai消息
  store.commit("addChatMsg", {
    chatIndex: chatHistoryIndex.value,
    tabIndex: activeTabIndex.value,
    message: {
      role: "robot",
      content: "",
    }
  });
  chatMsgDone.value = false;
  request(content, (success, data, done) => {
    console.log("request", success, data, done);
    if (bScroll) {
      bScroll.refresh();
    }
    if (success) {
      store.commit("setChatContent", {
        chatIndex: chatHistoryIndex.value,
        tabIndex: activeTabIndex.value,
        content: data,
      });
      chatMsgDone.value = done;
    } else {
      store.commit("setChatContent", {
        chatIndex: chatHistoryIndex.value,
        tabIndex: activeTabIndex.value,
        content: data,
      });
      chatMsgDone.value = true;
    }
  });
};

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
      <a-tabs class="chat-scroll-content" v-model:activeKey="activeTabIndex" type="editable-card" @edit="onEdit"
              size="small">
        <a-tab-pane v-for="(chatTab, chatTabIndex) in chatTabList" :key="chatTabIndex" :tab="chatTab.name">
          <div v-for="(item, index) in chatTab.chat" :key="index" class="message-item flex-row">
            <div class="avatar-img">
              <div class="system-avatar" v-if="item.role === 'system'">
                <a-avatar shape="square" size="large"
                          :style="{borderRadius: '5px', fontSize: '28px', background: '#0062BE'}">
                  <setting-outlined/>
                </a-avatar>
              </div>
              <div class="chat-gpt-avatar" v-if="item.role === 'robot'">
                <img src="../assets/images/chat_gpt.svg" alt="avatar"/>
              </div>
              <div class="user-avatar" v-if="item.role === 'user'">
                <a-avatar shape="square" size="large" :style="{borderRadius: '5px', background: '#C45500'}">User
                </a-avatar>
              </div>
            </div>
            <div class="message-content">
              <v-md-preview :text="item.content"></v-md-preview>
            </div>
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
    overflow: hidden;

    .chat-scroll-content {
      padding-bottom: 100px;
    }

    .message-item {
      padding: 20px 0;
      border-bottom: 1px solid #e8e8e8;

      .avatar-img {
        width: 40px;
        height: 40px;
        overflow: hidden;
        margin-right: 20px;

        .chat-gpt-avatar {
          padding: 5px;
          background-color: rgb(16, 163, 127);
          border-radius: 5px;

          img {
            width: 100%;
            height: 100%;

            svg {
              color: white;
            }
          }
        }
      }

      .message-content {
        flex: 1;
        font-size: 14px;
        padding-right: 40px;
      }
    }
  }
}
</style>

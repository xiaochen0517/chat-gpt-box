<script setup>
import {ref} from "vue";
import BScroll from '@better-scroll/core';
import ChatInputBlock from "./ChatInputBlock.vue";
import {request} from "../util/OpenAiUtil.js";

const customScrollbarRefs = ref(null);
const bScroll = BScroll('#chatBoxScrollBox', {
  disableMouse: true,
  disableTouch: false,
  mouseWheel: true,
  bounce: false,
  scrollY: true,
});

const chatBoxTitle = ref("聊天机器人");

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

</script>

<template>
  <div class="chat-box-block flex-column">
    <div class="chat-box-title">{{ chatBoxTitle }}</div>
    <div id="chatBoxScrollBox" class="chat-box-content">
      <div class="message-item flex-row">
        <div class="avatar-img">
          <img src="https://avatars.githubusercontent.com/u/15976103?v=4" alt="avatar"/>
        </div>
        <div class="message-content">{{ chatBoxContent }}</div>
      </div>
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

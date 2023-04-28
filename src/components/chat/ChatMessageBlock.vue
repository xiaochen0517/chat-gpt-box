<script setup>
import {SettingOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import MarkdownBlock from "@/components/chat/MarkdownBlock.vue";

defineProps({
  message: {
    type: Object,
    required: true,
    default: () => {
      return {
        role: "system",
        content: "..."
      };
    }
  },
  index: {
    type: Number,
    required: true,
    default: null
  }
});

</script>

<template>
  <div class="chat-message-block">
    <div class="chat-message-main flex-row">
      <div class="avatar-img">
        <div class="system-avatar" v-if="message.role === 'system'">
          <a-avatar shape="square" size="large" :style="{borderRadius: '5px', fontSize: '28px', background: '#0062BE'}">
            <setting-outlined/>
          </a-avatar>
        </div>
        <div class="chat-gpt-avatar" v-if="message.role === 'assistant'">
          <img src="../../assets/images/chat_gpt.svg" alt="avatar"/>
        </div>
        <div class="user-avatar" v-if="message.role === 'user'">
          <a-avatar shape="square" size="large" :style="{borderRadius: '5px', background: '#C45500'}">User
          </a-avatar>
        </div>
      </div>
      <div class="message-content">
        <MarkdownBlock :content="message.content"/>
      </div>
    </div>
    <div class="message-control-box flex-row">
      <a-button class="control-button" type="dashed" size="small" @click="$emit('delete', message, index)">
        <template #icon>
          <delete-outlined/>
        </template>
      </a-button>
      <a-button class="control-button" type="dashed" size="small" @click="$emit('edit', message, index)">
        <template #icon>
          <edit-outlined/>
        </template>
      </a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-message-block {
  padding: 5px 0;
  border-bottom: 1px solid @border-color;

  .chat-message-main {
    .avatar-img {
      width: 40px;
      height: 40px;
      overflow: hidden;
      margin: 10px 20px;

      .chat-gpt-avatar {
        padding: 5px;
        background-color: rgb(16, 163, 127);
        border-radius: 5px;

        img {
          width: 100%;
          height: 100%;

          svg {
            color: @primary-text-color;
          }
        }
      }
    }

    .message-content {
      flex: 1;
      font-size: 14px;
      padding-right: 40px;
      //color: @primary-text-color;
    }
  }

  .message-control-box {
    visibility: hidden;
    opacity: 0;
    justify-content: center;
    align-items: center;

    .control-button {
      margin: 5px 10px;
    }
  }

  &:hover {
    .message-control-box {
      visibility: visible;
      opacity: 1;
      transition: all 0.4s ease-in-out;
    }
  }
}
</style>

<style lang="less">
.github-markdown-body {
    padding: 10px;
}

.ant-btn-dashed{
    color: @primary-text-color;
}
</style>

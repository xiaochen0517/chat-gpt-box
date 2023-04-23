<script setup>
import {ref, onMounted, computed} from "vue";
import BScroll from "@better-scroll/core";
import {emit} from "@tauri-apps/api/event";
import {appWindow} from "@tauri-apps/api/window";
import {useStore} from "vuex";
import {notification} from 'ant-design-vue';

const store = useStore();
let bScroll = null;
onMounted(() => {
  bScroll = createBScroll();
  createAppCloseListener();
  initSettingsData();
});

const scrollWrapperRefs = ref(null);
const createBScroll = () => {
  return new BScroll(scrollWrapperRefs.value, {
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
const createAppCloseListener = () => {
  appWindow.onCloseRequested(() => {
    emit("resetSettingsWindow");
  });
};

// 请求openai的apiKey
const storeApiKey = computed(() => store.state.apiKey);
let apiKey = ref("");
// 是否按下enter键发送消息
const storeEnterSend = computed(() => store.state.config.enterSend);
let enterSend = ref(true);
const initSettingsData = () => {
  apiKey.value = storeApiKey.value;
  enterSend.value = storeEnterSend.value;
};

const openNotification = (type, message) => {
  notification[type]({
    message: message,
    description: "",
  });
};

const submit = () => {
  if (apiKey.value == "") {
    openNotification("error", "ApiKey不能为空");
    return;
  }
  if (enterSend.value == undefined) {
    openNotification("error", "消息发送方式不能为空");
    return;
  }
  store.commit("setApiKey", apiKey.value);
  store.commit("setEnterSend", enterSend.value);
};

const cancel = () => {
  emit("resetSettingsWindow");
  appWindow.close();
};
</script>

<template>
  <div class="settings-page">
    <h1>Settings Page</h1>
    <div ref="scrollWrapperRefs" class="scroll-wrapper">
      <div class="settings-form-box wrapper-content">
        <a-form label-align="left">
          <a-form-item label="ApiKey">
            <a-input v-model:value="apiKey" placeholder="请输入ApiKey"/>
          </a-form-item>
          <a-form-item label="回车键发送消息：">
            <a-switch v-model:checked="enterSend"/>
          </a-form-item>
          <a-form-item>
            <div class="commit-button-box flex-row">
              <a-button @click="cancel">取消</a-button>
              <a-button type="primary" @click="submit" style="margin-left: 50px">提交</a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.settings-page {
  width: 100%;
  max-height: 100%;
  min-height: 100%;

  .settings-form-box {
    padding: 20px 60px;

    .commit-button-box {
      justify-content: center;
    }
  }
}
</style>

<script setup>
import {ref, onMounted, computed} from "vue";
import BScroll from "@better-scroll/core";
import {emit} from "@tauri-apps/api/event";
import {appWindow} from "@tauri-apps/api/window";
import {useStore} from "vuex";

const store = useStore();
let apiKey = ref("");

const scrollWrapperRefs = ref(null);
let bScroll = null;
onMounted(() => {
  bScroll = new BScroll(scrollWrapperRefs.value, {
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
  appWindow.onCloseRequested(() => {
    emit("resetSettingsWindow");
  });
  apiKey.value = store.state.config.apiKey;
});

const enterSend = computed(() => store.state.config.enterSend);

const submit = () => {
  if (apiKey.value === "") {
    return;
  }
  store.commit("setApiKey", apiKey.value);
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
            <a-button @click="cancel">取消</a-button>
            <a-button type="primary" @click="submit">提交</a-button>
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
  }
}
</style>

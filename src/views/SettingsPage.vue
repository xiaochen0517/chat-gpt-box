<script setup>
import {ref, onMounted} from "vue";
import BScroll from "@better-scroll/core";

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
});

const formData = ref({
  apiKey: ""
});
</script>

<template>
  <div class="settings-page">
    <h1>Settings Page</h1>
    <div ref="scrollWrapperRefs" class="scroll-wrapper">
      <div class="settings-form-box wrapper-content">
        <a-form :model="form" label-align="left">
          <a-form-item label="ApiKey">
            <a-input v-model:value="formData.apiKey" placeholder="请输入ApiKey"/>
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

  .settings-form-box{
    padding: 20px 60px;
  }
}
</style>

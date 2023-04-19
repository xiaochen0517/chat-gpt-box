<script setup>
import ChatBoxBlock from "./components/ChatBoxBlock.vue";

import {ConfigProvider} from 'ant-design-vue';
import SideBarBlock from "./components/SideBarBlock.vue";

ConfigProvider.config({
  theme: {
    primaryColor: '#25b864',
  },
});

</script>

<template>
  <div class="app-container flex-row">
    <SideBarBlock/>
    <ChatBoxBlock class="flex-1"/>
  </div>
</template>

<style lang="less" scoped>
body,
html {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%;
}

.app-container {
  height: 100%;
  width: 100%;
}
</style>

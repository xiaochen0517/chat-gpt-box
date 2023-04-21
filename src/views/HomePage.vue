<script setup>
import {nextTick, ref} from "vue";
import {ConfigProvider} from 'ant-design-vue';
import SideBarBlock from "../components/SideBarBlock.vue";
import ChatBoxBlock from "../components/ChatBoxBlock.vue";

ConfigProvider.config({
  theme: {
    primaryColor: '#25b864',
  },
});

const chatBoxBlockRefs = ref(null);
const changeRobotClick = (index, item) => {
  nextTick(() => {
    if (chatBoxBlockRefs.value) {
      console.log("chatBoxBlockRefs", chatBoxBlockRefs.value);
      chatBoxBlockRefs.value.changeRobot(index, item);
    }
  });
};
</script>

<template>
  <div class="home-page flex-row">
    <SideBarBlock @onClick="changeRobotClick"/>
    <ChatBoxBlock ref="chatBoxBlockRefs" class="flex-1"/>
  </div>
</template>

<style lang="less" scoped>
.home-page {
  min-height: 100%;
  max-height: 100%;
  width: 100%;
}
</style>

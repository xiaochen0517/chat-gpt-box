<script setup>
import {nextTick, onMounted, ref} from "vue";
import SideBarBlock from "../components/sidebar/SideBarBlock.vue";
import {appWindow} from "@tauri-apps/api/window";
import {exit} from '@tauri-apps/api/process';
import ChatContentBlock from "../components/chat/block/ChatContentBlock.vue";
import {useStore} from "vuex";

const store = useStore();

/**
 * 监听窗口关闭事件，直接退出程序
 */
onMounted(() => {
  checkConfig();
  appWindow.onCloseRequested(async () => {
    await exit(0);
  });
});

/**
 * 检查配置项内容
 */
const checkConfig = () => {
  const oldVersion = store.state.version;
  const newVersion = import.meta.env.VITE_APP_VERSION;
  console.log(`oldVersion: ${oldVersion}, newVersion: ${newVersion}`);
};

const chatContentBlockRefs = ref(null);
const changeRobotClick = (index, item) => {
  nextTick(() => {
    if (chatContentBlockRefs.value) {
      chatContentBlockRefs.value.changeRobot(index, item);
    }
  });
};
</script>

<template>
  <div class="w-full h-full flex flex-row box-border">
    <SideBarBlock class="w-64" @onClick="changeRobotClick"/>
    <ChatContentBlock class="flex-1" ref="chatContentBlockRefs"/>
  </div>
</template>

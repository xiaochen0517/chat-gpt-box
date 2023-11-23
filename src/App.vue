<script setup lang="ts">
import {onMounted, watch} from "vue";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {v4 as uuidv4} from "uuid";

const configStore = useConfigStore();
const chatTabsStore = useChatTabsStore();
const chatListStore = useChatListStore();


onMounted(() => {
  // add dark class in html
  switchDarkMode(configStore.isDarkMode);
  chatTabsStore.initGeneralStatus();
  // check the configuration
  checkConfig();
});

const checkConfig = () => {
  const oldStoreJsonStr = localStorage.getItem("state");
  if (!oldStoreJsonStr) return;
  let oldStore;
  try {
    oldStore = JSON.parse(oldStoreJsonStr);
  } catch (ignore) {
    return;
  }
  if (!oldStore && !oldStore.version) return;
  chatListStore.chatList = [];
  chatTabsStore.chatTabs = {};
  for (let index = 0; index < oldStore.robotList.length; index++) {
    let chatInfo = oldStore.robotList[index];
    let chatTab = oldStore.chatHistory[index];
    if (!chatInfo || !chatTab) continue;
    const chatId = uuidv4();
    chatInfo['id'] = chatId;
    chatListStore.chatList.push(chatInfo);
    chatTabsStore.chatTabs[chatId] = chatTab;
  }
  configStore.isDarkMode = oldStore.config.isDarkMode;
  configStore.baseConfig = oldStore.config.base;
  configStore.shortcut = oldStore.config.shortcut;

  localStorage.removeItem("state");
}

watch(() => configStore.isDarkMode, (newVal) => {
  // add dark class in html
  switchDarkMode(newVal);
});

/**
 * if isDark is true, add dark class in html
 * else remove dark class in html
 * @param isDark is dark mode
 */
const switchDarkMode = (isDark: boolean) => {
  let querySelector = document.querySelector("html");
  if (!querySelector) {
    return;
  }
  if (isDark) {
    querySelector.classList.add("dark");
  } else {
    querySelector.classList.remove("dark");
  }
}

</script>

<template>
  <div class="bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white flex-row w-full h-full">
    <router-view v-slot="{Component}">
      <transition name="el-zoom-in-top" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>

<style lang="less">
@import "assets/icons/iconfont.css";

body,
html {
@apply p-0 m-0 h-screen w-full;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

#app {
@apply h-full w-full text-sm;
}
</style>

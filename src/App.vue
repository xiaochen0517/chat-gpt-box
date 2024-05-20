<script setup lang="ts">
import {onMounted, watch} from "vue";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {useAppStateStore} from "@/store/AppStateStore.ts";
import {v4 as uuidv4} from "uuid";
import {appWindow, PhysicalPosition, PhysicalSize} from "@tauri-apps/api/window";
import {exit} from "@tauri-apps/api/process";
import AppUtil from "@/utils/AppUtil.ts";
import {WindowState} from "@/types/StoreTypes.ts";
import {StoreDataMigration} from "@/service/config/StoreDataMigration.ts";

const configStore = useConfigStore();
const chatTabsStore = useChatTabsStore();
const chatListStore = useChatListStore();
const appStateStore = useAppStateStore();

onMounted(async () => {
  StoreDataMigration.migrate();
  // add dark class in html
  switchDarkMode(configStore.isDarkMode);
  chatTabsStore.initGeneralStatus();
  checkConfig();
  addTauriListener();
  await recoverWindowState();
});

const addTauriListener = () => {
  if (!AppUtil.isTauri()) return;
  appWindow.onCloseRequested(async () => {
    await saveWindowState();
    await exit(0);
  });
  appWindow.onResized(async (event) => {
    let oldWidth = appStateStore.windowSize.width;
    let oldHeight = appStateStore.windowSize.height;
    appStateStore.setWindowSize(event.payload.width, event.payload.height);
    await saveWindowState();
    // If the current window is maximized and then refreshed, it will cause the maximization to fail,
    // and maximizing will trigger a resize, leading to incorrect display size when returning to normal.
    setTimeout(async () => {
      if (await appWindow.isMaximized()) {
        appStateStore.setWindowSize(oldWidth, oldHeight);
      }
    }, 100);
  });
  appWindow.onMoved((event) => {
    appStateStore.setWindowPosition(event.payload.x, event.payload.y);
  });
};

const saveWindowState = async () => {
  // get current window state
  const isMaximized = await appWindow.isMaximized();
  appStateStore.setWindowState(isMaximized ? WindowState.Maximized : WindowState.Normal);
};

const recoverWindowState = async () => {
  if (!AppUtil.isTauri()) return;
  await appWindow.setSize(new PhysicalSize(appStateStore.windowSize.width, appStateStore.windowSize.height));
  await appWindow.setPosition(new PhysicalPosition(appStateStore.windowPosition.x, appStateStore.windowPosition.y));
  if (appStateStore.windowState === WindowState.Maximized) {
    await appWindow.maximize();
  }
};

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
    chatInfo["id"] = chatId;
    chatListStore.chatList.push(chatInfo);
    chatTabsStore.chatTabs[chatId] = chatTab;
  }
  configStore.isDarkMode = oldStore.config.isDarkMode;
  configStore.baseConfig = oldStore.config.base;
  configStore.shortcut = oldStore.config.shortcut;

  localStorage.removeItem("state");
};

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
};

</script>

<template>
  <div class="bg-neutral-100 text-black dark:bg-neutral-800 dark:text-stone-200 flex-row w-full h-full">
    <router-view v-slot="{Component}">
      <transition name="el-zoom-in-top" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>

<style lang="postcss">
@import "assets/icons/iconfont.css";

body,
html {
  @apply p-0 m-0 h-screen w-full;
  font-family: "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
}

#app {
  @apply h-full w-full text-sm;
}
</style>

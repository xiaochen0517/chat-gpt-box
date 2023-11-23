<script setup lang="ts">
import {onMounted, watch} from "vue";
import {useChatTabsStore} from "@/store/ChatTabs.ts";
import {useConfigStore} from "@/store/Config.ts";

const configStore = useConfigStore();

const chatTabsStore = useChatTabsStore();
onMounted(() => {
  // add dark class in html
  switchDarkMode(configStore.isDarkMode);
  chatTabsStore.initGeneralStatus();
});

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

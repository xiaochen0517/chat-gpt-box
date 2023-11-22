<script setup lang="ts">

import {useStore} from "@/store/store.ts";
import {computed, onMounted, Ref, watch} from "vue";

const store = useStore();

const isDarkMode: Ref<boolean> = computed(() => store.config.isDarkMode);

onMounted(() => {
  // add dark class in html
  switchDarkMode(isDarkMode.value);
  store.initGeneralStatus();
});

watch(isDarkMode, (newVal) => {
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
    <transition name="el-zoom-in-top" mode="out-in">
      <router-view/>
    </transition>
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

/* scroll bar */
div::-webkit-scrollbar {
  @apply w-2 h-2 rounded-full;
}

div::-webkit-scrollbar-track {
  @apply bg-neutral-300 dark:bg-neutral-800 rounded-full;
}

div::-webkit-scrollbar-thumb {
  @apply bg-neutral-400 dark:bg-neutral-600 rounded-full;
}

div::-webkit-scrollbar-thumb:hover {
  @apply bg-neutral-500 dark:bg-neutral-700;
}
</style>

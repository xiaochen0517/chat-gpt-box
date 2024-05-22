<script setup lang="ts">
import {useAppStateStore} from "@/store/AppStateStore.ts";
import {computed, getCurrentInstance} from "vue";

const instance = getCurrentInstance();
const appStateStore = useAppStateStore();
const activeLockScrollDown = computed(() => appStateStore.lockScrollDown);

const lockScrollDownClick = () => {
  appStateStore.lockScrollDown = !appStateStore.lockScrollDown;
  instance?.emit("lockScrollDownClick");
};
const scrollUpClick = () => {
  instance?.emit("scrollUpClick");
};
defineEmits([
  "lockScrollDownClick",
  "scrollUpClick",
]);

</script>

<template>
  <div class="absolute right-6 bottom-4 rounded-2xl bg-neutral-200 dark:bg-neutral-900 p-1.5">
    <div
        class="rounded-xl p-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700 cursor-pointer"
        @click.stop="scrollUpClick"
    >
      <i class="iconfont icon-up-arrow text-lg leading-3"/>
    </div>
    <div
        class="rounded-xl p-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700 cursor-pointer"
        @click.stop="lockScrollDownClick"
    >
      <i
          class="iconfont icon-down-arrow text-lg leading-3"
          :class="{'text-green-500 dark:text-green-400':activeLockScrollDown}"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>

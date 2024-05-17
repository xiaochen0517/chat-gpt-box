<script setup lang="ts">
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;

</script>

<template>
  <div class="w-full flex flex-row gap-2 p-2">
    <div
        class="flex-1 w-10 h-10 flex justify-center items-center rounded-md border dark:border-0 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-600 active:dark:bg-neutral-700 cursor-pointer"
        @click="$router.push({path: '/chat/editor/add'})"
    >
      <i class="iconfont icon-add text-xl"/>
      <span class="ml-1">{{ t("sidebar.addChat.button") }}</span>
    </div>
    <div
        class="flex-1 w-10 h-10 flex justify-center items-center rounded-md bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-600 active:dark:bg-neutral-700 cursor-pointer"
        @click="$router.push({path: '/chat/template'})"
    >
      <i class="iconfont icon-message-comments text-xl"/>
      <span class="ml-1">{{ t("sidebar.template.button") }}</span>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
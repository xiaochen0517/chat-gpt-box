<script setup lang="ts">
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;

</script>

<template>
  <div class="w-full flex flex-row justify-between px-2 py-1 mt-2">
    <div
        class="w-8 h-8 flex justify-center items-center rounded-md bg-opacity-20 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-900 hover:dark:bg-neutral-800 active:dark:bg-neutral-700 cursor-pointer"
        @click="$router.push({path: '/chat/editor/add'})"
        :title="t('sidebar.addChat.button')"
    >
      <i class="iconfont icon-add text-xl"/>
    </div>
    <div
        class="w-8 h-8 flex justify-center items-center rounded-md bg-opacity-20 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-900 hover:dark:bg-neutral-800 active:dark:bg-neutral-700 cursor-pointer"
        @click="$router.push({path: '/chat/template'})"
        :title="t('sidebar.template.button')"
    >
      <i class="iconfont icon-message-comments text-xl"/>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>

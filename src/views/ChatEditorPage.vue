<script setup lang="ts">
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import router from "@/router/Router.ts";

const jumpToHomePage = () => {
  router.push({path: "/"});
}
</script>

<template>
  <div class="w-full h-full bg-neutral-50 dark:bg-neutral-900">
    <CTopNavBar title="Chat Editor" @backClick="jumpToHomePage"/>
  </div>
</template>
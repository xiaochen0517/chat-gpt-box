<script setup lang="ts">
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";

</script>

<template>
  <div class="w-full h-screen bg-neutral-50 dark:bg-neutral-900 overflow-y-auto">
    <CTopNavBar :title="$t('chatTemplate.pageTitle')" @backClick="$router.back()"/>
  </div>
</template>
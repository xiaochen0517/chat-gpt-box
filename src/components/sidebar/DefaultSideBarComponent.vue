<script setup lang="ts">
import SideBarContainer from "@/components/sidebar/SideBarContainer.vue";
</script>

<template>
  <SideBarContainer
      class="box-border border-r-2 dark:border-0 bg-neutral-50 dark:bg-neutral-800"
      @changeChatClick="$emit('changeChatClick', $event)"
  />
</template>

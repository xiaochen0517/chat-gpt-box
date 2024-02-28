<script setup lang="ts">
import ChatBotListComponent from "@/components/sidebar/ChatBotListComponent.vue";
import SideBarBottom from "@/components/sidebar/SideBarBottom.vue";
import SideBarTop from "@/components/sidebar/SideBarTop.vue";

defineEmits([
  "changeChatClick",
]);
</script>

<template>
  <div class="h-full w-80 flex flex-col">
    <SideBarTop/>
    <ChatBotListComponent @changeChatClick="$emit('changeChatClick', $event)"/>
    <SideBarBottom/>
  </div>
</template>

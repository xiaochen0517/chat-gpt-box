<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import BottomMenuComponent from "@/components/sidebar/BottomMenuComponent.vue";
import ChatBotListComponent from "@/components/sidebar/ChatBotListComponent.vue";

import {ChatInfo} from "@/types/chat/ChatInfo.ts";

const instance = getCurrentInstance();
const changeChatClick = (chatInfo: ChatInfo) => {
  if (!instance) return;
  instance.emit("changeChatClick", chatInfo);
};

const robotListBlockRefs = ref<InstanceType<typeof ChatBotListComponent> | null>(null);
const robotListScrollToBottom = () => {
  if (!robotListBlockRefs.value) return;
  robotListBlockRefs.value.scrollToBottom();
};

const drawerVisible = ref(false);

const show = () => {
  drawerVisible.value = true;
};
const hide = () => {
  drawerVisible.value = false;
};
defineExpose({
  show,
  hide,
});
</script>

<template>
  <el-drawer
      v-model="drawerVisible"
      :show-close="false"
      :with-header="false"
      :append-to-body="true"
      direction="ltr"
      size="20rem"
  >
    <div class="h-full w-80 flex flex-col">
      <ChatBotListComponent
          class="flex-1"
          ref="robotListBlockRefs"
          @changeChatClick="changeChatClick"
      />
      <BottomMenuComponent @added-robot="robotListScrollToBottom"/>
    </div>
  </el-drawer>
</template>

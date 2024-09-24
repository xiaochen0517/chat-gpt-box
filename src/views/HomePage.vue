<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import DefaultSideBarComponent from "@/components/sidebar/DefaultSideBarComponent.vue";
import HomeChatComponent from "@/components/chat/block/HomeChatComponent.vue";

import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import NewVersionInfoDialog from "@/components/updater/NewVersionInfoDialog.vue";
import UpdateUtil from "@/utils/UpdateUtil.ts";
import {ElMessage} from "element-plus";
import logger from "@/utils/logger/Logger.ts";

const chatContentBlockRefs = ref<InstanceType<typeof HomeChatComponent> | null>(null);
const changeChatClick = (chatInfo: ChatInfo) => {
  nextTick(() => {
    if (!chatContentBlockRefs.value) return;
    chatContentBlockRefs.value.changeChat(chatInfo);
  });
};

const newVersionInfoDialogRef = ref<InstanceType<typeof NewVersionInfoDialog> | null>(null);
const checkUpdate = () => {
  setTimeout(async () => {
    if (await UpdateUtil.checkUpdate()) {
      ElMessage.success("New version available");
      logger.info("New version available");
      newVersionInfoDialogRef.value?.show();
    }
  });
};
onMounted(() => {
  checkUpdate();
});
</script>

<template>
  <div class="w-full h-full flex flex-row box-border">
    <DefaultSideBarComponent class="hidden mobile:flex" @changeChatClick="changeChatClick"/>
    <HomeChatComponent class="flex-1" ref="chatContentBlockRefs"/>
    <NewVersionInfoDialog ref="newVersionInfoDialogRef"/>
  </div>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";
import MenuListBlock from "@/components/sidebar/MenuListBlock.vue";
import RobotListBlock from "@/components/sidebar/ChatListBlock.vue";
import {ChatInfo} from "@/types/Store.ts";

const instance = getCurrentInstance();
const changeChatClick = (chatInfo: ChatInfo) => {
  console.log('changeChatClick')
  if (!instance) return;
  instance.emit('changeChatClick', chatInfo);
};

onMounted(() => {
  console.log('SlideSideBarBlock mounted');
});

const robotListBlockRefs = ref<InstanceType<typeof RobotListBlock> | null>(null);
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
      size="20rem">
    <div class="h-full w-80 flex flex-col">
      <RobotListBlock
          class="flex-1"
          ref="robotListBlockRefs"
          @changeChatClick="changeChatClick"/>
      <MenuListBlock @added-robot="robotListScrollToBottom"/>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import MenuListBlock from "@/components/sidebar/MenuListBlock.vue";
import RobotListBlock from "@/components/sidebar/RobotListBlock.vue";

/**
 * 初始化机器人列表
 */
const instance = getCurrentInstance();
const onRobotClick = (index: number, item: number) => {
  if (!instance) return;
  instance.emit('onClick', index, item);
  drawerVisible.value = false;
};

const robotListBlockRefs = ref<InstanceType<typeof RobotListBlock> | null>(null);
const robotListScrollToBottom = () => {
  if (!robotListBlockRefs.value) return;
  robotListBlockRefs.value.scrollToBottom();
};

const drawerVisible = ref(false);

const show = () => {
  drawerVisible.value = true;
};
defineExpose({
  show
});
</script>

<template>
  <el-drawer
      v-model="drawerVisible"
      :show-close="false"
      :with-header="false"
      direction="ltr"
      size="20rem">
    <div class="h-full w-80 flex flex-col">
      <RobotListBlock
          class="flex-1"
          ref="robotListBlockRefs"
          @onClick="onRobotClick"/>
      <MenuListBlock @added-robot="robotListScrollToBottom"/>
    </div>
  </el-drawer>
</template>

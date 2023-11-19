<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import RobotListBlock from "./RobotListBlock.vue";
import MenuListBlock from "./MenuListBlock.vue";
import {Robot} from "@/types/State.ts";

/**
 * 初始化机器人列表
 */
const instance = getCurrentInstance();
const onRobotClick = (index: number, item: Robot) => {
  if (!instance) return;
  instance.emit('onClick', index, item);
};

const robotListBlockRefs = ref<InstanceType<typeof RobotListBlock> | null>(null);
const robotListScrollToBottom = () => {
  if (!robotListBlockRefs.value) return;
  robotListBlockRefs.value.scrollToBottom();
};

</script>

<template>
  <div class="h-full w-80 flex flex-col box-border border-r-2 dark:border-0 bg-neutral-50 dark:bg-neutral-800">
    <RobotListBlock class="flex-1" ref="robotListBlockRefs" @onClick="onRobotClick"/>
    <MenuListBlock @added-robot="robotListScrollToBottom"/>
  </div>
</template>

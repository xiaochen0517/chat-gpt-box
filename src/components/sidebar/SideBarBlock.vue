<script setup>
import {getCurrentInstance, ref} from "vue";
import {useStore} from "vuex";
import RobotListBlock from "./RobotListBlock.vue";
import MenuListBlock from "./MenuListBlock.vue";

/**
 * 初始化机器人列表
 */
const store = useStore();

const {emit} = getCurrentInstance();
const onRobotClick = (index, item) => {
  emit('onClick', index, item);
};

const robotListBlockRefs = ref(null);
const robotListScrollToBottom = () => {
  robotListBlockRefs.value.scrollToBottom();
};

</script>

<template>
  <div class="h-full flex flex-col box-border border-r-2 dark:border-0 bg-gray-100 dark:bg-gray-900">
    <RobotListBlock class="flex-1" ref="robotListBlockRefs" @on-click="onRobotClick"/>
    <MenuListBlock @added-robot="robotListScrollToBottom"/>
  </div>
</template>

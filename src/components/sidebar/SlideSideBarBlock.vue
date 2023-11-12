<script setup>
import {getCurrentInstance, ref} from "vue";
import MenuListBlock from "@/components/sidebar/MenuListBlock.vue";
import RobotListBlock from "@/components/sidebar/RobotListBlock.vue";
import {useStore} from "vuex";

/**
 * 初始化机器人列表
 */
const store = useStore();

const {emit} = getCurrentInstance();
const onRobotClick = (index, item) => {
  emit('onClick', index, item);
  drawerVisible.value = false;
};

const robotListBlockRefs = ref(null);
const robotListScrollToBottom = () => {
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
      size="70%">
    <div class="h-full w-full flex flex-col">
      <RobotListBlock
          class="flex-1"
          ref="robotListBlockRefs"
          @onClick="onRobotClick"/>
      <MenuListBlock @added-robot="robotListScrollToBottom"/>
    </div>
  </el-drawer>
</template>

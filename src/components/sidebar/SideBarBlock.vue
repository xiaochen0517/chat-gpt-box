<script setup>
import {getCurrentInstance} from "vue";
import {useStore} from "vuex";
import RobotListBlock from "./RobotListBlock.vue";
import MenuListBlock from "./MenuListBlock.vue";

/**
 * 初始化机器人列表
 */
const store = useStore();

const {emit} = getCurrentInstance();
const onRobotClick = (index, item) => {
  console.log("onRobotClick", index, item);
  emit('onClick', index, item);
};

</script>

<template>
  <div class="side-bar-block position-relative flex-column">
    <RobotListBlock @on-click="onRobotClick"/>
    <MenuListBlock/>
  </div>
</template>

<style lang="less" scoped>
.side-bar-block {
  width: 20%;
  min-height: 100vh;
  max-height: 100vh;
  border-right: 1px solid #e8e8e8;
  position: relative;
}
</style>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, nextTick, getCurrentInstance} from "vue";
import {useStore} from "vuex";
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ScrollBar from '@better-scroll/scroll-bar';

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

const store = useStore();
let bScroll = null;
const robotListRefs = ref(null);
onMounted(() => {
  bScroll = new BScroll(robotListRefs.value, {
    disableMouse: false,
    disableTouch: false,
    bounce: false,
    scrollY: true,
    scrollbar: true,
    mouseWheel: {
      speed: 20,
      invert: false,
      easeTime: 300
    }
  });
});

onBeforeUnmount(() => {
  if (bScroll) {
    bScroll.destroy();
  }
});

const robotList = computed(() => {
  return store.state.robotList;
});
const addRobotClick = () => {
  store.commit("addRobot", {
    prompt: "test",
    name: "test",
    options: {
      model: "gpt-3.5-turbo"
    }
  });
  if (bScroll) {
    nextTick(() => {
      console.log("refresh");
      bScroll.refresh();
    });
  }
};
const instance = getCurrentInstance();
const robotListClick = (index, item) => {
  console.log(index, item);
  instance.emit("onClick", index, item);
};

const key = ref("");
const saveApiKey = () => {
  console.log("key", key.value);
  if (key.value.length <= 0) {
    return;
  }
  store.commit("setApiKey", key.value);
};
</script>

<template>
  <div class="side-bar-block position-relative">
    <div ref="robotListRefs" class="robot-list scroll-wrapper">
      <div class="robot-content scroll-content">
        <div v-for="(item, index) in robotList" :key="index" class="robot-list-item scroll-item"
             @click="robotListClick(index, item)">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="control-box position-absolute">
      <a-button class="add-robot-button" type="primary" @click="addRobotClick">Add Robot</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.side-bar-block {
  width: 20%;
  min-height: 100%;
  max-height: 100%;

  .robot-list {
    max-height: 90%;
    position: relative;
    overflow: hidden;

    .robot-content {
      margin-bottom: 100px;

      .robot-list-item {
        padding: 10px;
        border-bottom: 1px solid #e8e8e8;
        cursor: pointer;
      }
    }
  }

  .control-box {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10%;
    padding: 10px;
    background-color: white;
    display: flex;
    align-items: center;

    .add-robot-button {
      width: 100%;
    }
  }
}
</style>

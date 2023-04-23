<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import {useStore} from "vuex";

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

let bScroll = null;
onMounted(() => {
  bScroll = createBScroll();
});
onBeforeUnmount(() => {
  if (bScroll) {
    bScroll.destroy();
  }
});
const robotListRefs = ref(null);
const createBScroll = () => {
  return new BScroll(robotListRefs.value, {
    disableMouse: true,
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
};

const store = useStore();
const robotList = computed(() => {
  return store.state.robotList;
});

</script>

<template>
  <div ref="robotListRefs" class="robot-list-block scroll-wrapper">
    <div class="robot-content scroll-content">
      <div v-for="(item, index) in robotList" :key="index" class="robot-list-item scroll-item"
           @click="$emit('onClick', index, item)">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.robot-list-block {
  flex: 1;
  overflow: hidden;

  .robot-content {

    .robot-list-item {
      padding: 10px;
      border-bottom: 1px solid #e8e8e8;
      cursor: pointer;
    }
  }

}
</style>

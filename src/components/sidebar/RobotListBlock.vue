<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import {useStore} from "vuex";
import {EllipsisOutlined} from "@ant-design/icons-vue";
import EditRobotDialog from "../dialog/EditRobotDialog.vue";

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

const robotListPopoverVisible = ref(false);
const editRobotDialogRefs = ref(null);
const editRobotClick = (index) => {
  editRobotDialogRefs.value.show(index);
  robotListPopoverVisible.value = false;
};

const scrollToBottom = () => {
  nextTick(() => {
    if (bScroll) {
      bScroll.refresh();
      bScroll.scrollTo(0, bScroll.maxScrollY, 300);
    }
  });
};
defineExpose({
  scrollToBottom
});

</script>

<template>
  <div ref="robotListRefs" class="robot-list-block scroll-wrapper">
    <div class="robot-content scroll-content">
      <div v-for="(item, index) in robotList" :key="index" class="robot-list-item scroll-item flex-row"
           @click="$emit('onClick', index, item)">
        <div class="robot-item-label">
          {{ item.name }}
        </div>
        <a-popover overlayClassName="robot-editor-popover" placement="bottomRight" trigger="hover">
          <template #content>
            <div class="popover-box">
              <div class="popover-button edit-robot-button" @click.stop="editRobotClick(index)">编辑机器人</div>
              <div class="popover-button delete-robot-button">删除机器人</div>
            </div>
          </template>
          <div class="robot-control-button" @click.stop="">
            <ellipsis-outlined/>
          </div>
        </a-popover>
      </div>
    </div>
    <EditRobotDialog ref="editRobotDialogRefs" :is-edit="true"/>
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

      .robot-item-label {
        flex: 1;
      }

      .robot-control-button {
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        padding: 5px 10px;

        &:hover {
          background-color: #e8e8e8;
        }
      }
    }
  }

}
</style>

<style lang="less">

.robot-editor-popover {
  overflow: hidden;

  .ant-popover-inner-content {
    padding: 0;

    .popover-box {
      border-radius: 5px;
      border: 1px solid #e8e8e8;

      .popover-button {
        padding: 5px 20px;
        cursor: pointer;
        font-size: 14px;
        line-height: 24px;

        &:hover {
          background-color: #e8e8e8;
        }
      }
    }
  }
}
</style>

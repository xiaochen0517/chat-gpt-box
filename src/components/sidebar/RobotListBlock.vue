<script setup>
import {computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import {useStore} from "vuex";
import {EllipsisOutlined} from "@ant-design/icons-vue";
import EditRobotDialog from "../dialog/EditRobotDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

const instance = getCurrentInstance();
const activeRobotIndex = ref(0);
const changeActiveRobot = (index, item) => {
  activeRobotIndex.value = index;
  instance.emit('onClick', index, item);
};

const store = useStore();
const shortcut = computed(() => store.state.config.shortcut);
const keys = useMagicKeys();
const prevRobotKey = keys[shortcut.value.prevRobot];
whenever(prevRobotKey, () => {
  const index = activeRobotIndex.value - 1;
  if (index >= 0) {
    changeActiveRobot(index, robotList.value[index]);
  }
});
const nextRobotKey = keys[shortcut.value.nextRobot];
whenever(nextRobotKey, () => {
  const index = activeRobotIndex.value + 1;
  if (index < robotList.value.length) {
    changeActiveRobot(index, robotList.value[index]);
  }
});
const switchRobotKey = keys[shortcut.value.switchRobot];
whenever(switchRobotKey, () => {
  const index = activeRobotIndex.value + 1;
  if (index < robotList.value.length) {
    changeActiveRobot(index, robotList.value[index]);
  } else {
    changeActiveRobot(0, robotList.value[0]);
  }
});

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
           :class="index == activeRobotIndex?'robot-item-selected':''" @click="changeActiveRobot(index, item)">
        <div class="robot-item-label">
          {{ item.name }}
        </div>
        <a-popover overlayClassName="robot-editor-popover" placement="bottomRight" trigger="click">
          <template #content>
            <div class="popover-box">
              <div class="popover-button edit-robot-button" @click.stop="editRobotClick(index)">编辑机器人</div>
              <div class="popover-button delete-robot-button">删除机器人</div>
            </div>
          </template>
          <div class="robot-control-button flex-row" @click.stop="">
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
      border-bottom: 1px solid @border-color;
      cursor: pointer;
      background-color: @primary-bg-color;

      &:hover {
        background-color: @primary-bg-color;
      }

      .robot-item-label {
        flex: 1;
        line-height: 24px;
        color: @primary-text-color;
      }

      .robot-control-button {
        border: 1px solid @border-color;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;

        &:hover {
          background-color: @primary-bg-color;
        }
      }
    }

    .robot-item-selected {
      background-color: @primary-bg-color;
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
      overflow: hidden;
      border: 1px solid @border-color;
      background-color: @primary-bg-color;
      color: @primary-text-color;

      .popover-button {
        padding: 5px 20px;
        cursor: pointer;
        font-size: 14px;
        line-height: 24px;

        &:hover {
          background-color: @primary-dark-bg-color;
        }
      }
    }
  }
}

.ant-popover-arrow-content{
  background-color: @primary-bg-color;
}

.ant-popover-inner{
  background-color: transparent;
}
</style>

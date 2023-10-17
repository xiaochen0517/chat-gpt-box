<script setup>
import {computed, getCurrentInstance, onBeforeUnmount, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {EllipsisOutlined} from "@ant-design/icons-vue";
import EditRobotDialog from "../dialog/EditRobotDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";

onMounted(() => {
// 监听点击事件
  addEventListener("click", (e) => {
    if (robotListRefs.value && !robotListRefs.value.contains(e.target)) {
      robotList.value.forEach((item) => {
        if (item.showPopover) {
          item.showPopover = false;
        }
      });
    }
  });
});

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

onBeforeUnmount(() => {
});
const robotListRefs = ref(null);

const robotList = computed(() => {
  return store.state.robotList;
});

const robotListPopoverVisible = ref(false);
const editRobotDialogRefs = ref(null);
const editRobotClick = (index) => {
  editRobotDialogRefs.value.show(index);
  robotListPopoverVisible.value = false;
};
</script>

<template>
  <div ref="robotListRefs" class="overflow-hidden overflow-y-auto">
    <div class="min-h-full">
      <div v-for="(item, index) in robotList" :key="index"
           class="flex flex-row relative w-full cursor-pointer box-border px-2 mb-2 rounded-sm hover:bg-slate-800 active:bg-gray-900"
           :class="index === activeRobotIndex?'robot-item-selected':''" @click="changeActiveRobot(index, item)">
        <div class="text-md flex-1 leading-10">
          {{ item.name }}
        </div>
        <div class="flex justify-center items-center" @click="item.showPopover = true">
          <ellipsis-outlined/>
        </div>
        <div v-if="item.showPopover" class="absolute top-10 right-0">
          123
        </div>
        <a-popover overlayClassName="robot-editor-popover" placement="bottomRight" trigger="click">
          <template #content>
            <div class="p-0 m-0">
              <div @click.stop="editRobotClick(index)" class="cursor-pointer rounded-md hover:bg-slate-800">
                编辑机器人
              </div>
              <div class="">删除机器人</div>
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

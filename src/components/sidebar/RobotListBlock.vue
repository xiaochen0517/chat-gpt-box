<script setup>
import {computed, getCurrentInstance, onBeforeUnmount, ref} from "vue";
import {useStore} from "vuex";
import {EllipsisOutlined} from "@ant-design/icons-vue";
import EditRobotDialog from "../dialog/EditRobotDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";

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
    <div class="min-h-full p-2">
      <div v-for="(item, index) in robotList" :key="index"
           class="flex flex-row w-full cursor-pointer box-border p-2 mb-2 border border-red-50 dark:border-slate-600 rounded-md shadow-md dark:bg-gray-800 hover:bg-gray-700 hover:border-gray-700 active:bg-gray-900 active:border-gray-900"
           :class="index === activeRobotIndex?'robot-item-selected':''" @click="changeActiveRobot(index, item)">
        <div class="text-md flex-1">
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

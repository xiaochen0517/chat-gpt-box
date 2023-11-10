<script setup>
import {computed, getCurrentInstance, onBeforeUnmount, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {EllipsisOutlined} from "@ant-design/icons-vue";
import EditRobotDialog from "../chat/dialog/EditRobotDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";

const instance = getCurrentInstance();
const activeRobotIndex = ref(0);
const changeActiveRobot = (index, item) => {
  activeRobotIndex.value = index;
  instance.emit('onClick', index, item);
};

/**
 * 快捷键操作
 */
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

const scrollToBottom = () => {
  robotListRefs.value.scrollTop = robotListRefs.value.scrollHeight;
};

defineExpose({
  scrollToBottom
});
</script>

<template>
  <div ref="robotListRefs" class="overflow-hidden overflow-y-auto">
    <div class="min-h-full">
      <div v-for="(item, index) in robotList" :key="index"
           class="flex flex-row items-center relative w-full cursor-pointer box-border px-2 mb-2 rounded-sm hover:bg-gray-300 active:bg-gray-400 dark:hover:bg-slate-800 dark:active:bg-gray-900"
           :class="index === activeRobotIndex?'robot-item-selected':''" @click="changeActiveRobot(index, item)">
        <div class="text-md flex-1 leading-10">
          {{ item.name }}
        </div>
        <el-popover overlayClassName="robot-editor-popover" placement="bottom" trigger="hover">
          <template #default>
            <div class="p-2 m-0">
              <div @click.stop="editRobotClick(index)"
                   class="cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 leading-6 box-border py-1 px-2 mb-1">
                Edit Chat
              </div>
              <div
                  class="cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 leading-6 box-border py-1 px-2">
                Delete Chat
              </div>
            </div>
          </template>
          <template #reference>
            <div
                class="robot-control-button flex justify-center items-center hover:bg-gray-400 dark:hover:bg-slate-700 w-6 h-6 rounded-md"
                @click.stop="">
              <ellipsis-outlined/>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
    <EditRobotDialog ref="editRobotDialogRefs" :is-edit="true"/>
  </div>
</template>

<style>
/* element-ui popover 内边距重置 */
.el-popover {
  --el-popover-padding: 0;
}
</style>

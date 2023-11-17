<script setup lang="ts">
import {computed, getCurrentInstance, onBeforeUnmount, ref} from "vue";
import {useStore} from "@/store/store.ts";
import {EllipsisOutlined} from "@ant-design/icons-vue";
import EditRobotDialog from "../chat/dialog/EditRobotDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {Robot} from "@/types/State.ts";

const instance = getCurrentInstance();
const activeRobotIndex = ref(0);
const changeActiveRobot = (index: number, item: Robot) => {
  if (!instance) return;
  activeRobotIndex.value = index;
  instance.emit('onClick', index, item);
};

/**
 * 快捷键操作
 */
const store = useStore();
const shortcut = computed(() => store.config.shortcut);
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

const robotList = computed(() => {
  return store.robotList;
});

const robotListPopoverVisible = ref(false);
const editRobotDialogRefs = ref<InstanceType<typeof EditRobotDialog> | null>(null);
const editRobotClick = (index: number) => {
  if (!editRobotDialogRefs.value) return;
  editRobotDialogRefs.value.show(true, index);
  robotListPopoverVisible.value = false;
};

const robotListRefs = ref<InstanceType<typeof HTMLDivElement> | null>(null);
const scrollToBottom = () => {
  if (!robotListRefs.value) return;
  robotListRefs.value.scrollTop = robotListRefs.value.scrollHeight;
};

defineExpose({
  scrollToBottom
});
</script>

<template>
  <div
      ref="robotListRefs"
      class="overflow-hidden overflow-y-auto">
    <div class="min-h-full">
      <div
          class="flex flex-row items-center relative w-full cursor-pointer box-border px-2 py-1 rounded-sm hover:bg-gray-300 active:bg-gray-400 dark:hover:bg-slate-800 dark:active:bg-gray-900"
          v-for="(item, index) in robotList"
          :key="index"
          :class="index === activeRobotIndex?'robot-item-selected':''"
          @click="changeActiveRobot(index, item)">
        <div class="text-md flex-1 leading-10">
          {{ item.name }}
        </div>
        <el-popover overlayClassName="robot-editor-popover" placement="bottom" trigger="click">
          <template #default>
            <div class="p-2 m-0">
              <div
                  @click.stop="editRobotClick(index)"
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
    <EditRobotDialog ref="editRobotDialogRefs"/>
  </div>
</template>

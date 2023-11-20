<script setup lang="ts">
import {computed, getCurrentInstance, ref} from "vue";
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
 * Shortcuts configuration.
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

const tooltipEffect = computed(() => store.config.isDarkMode ? 'dark' : 'light');

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
    <div class="min-h-full max-h-0 p-1">
      <div
          class="flex flex-row items-center relative w-full cursor-pointer box-border px-2 py-1 mb-1 rounded-xl hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
          v-for="(item, index) in robotList"
          :key="index"
          :class="index === activeRobotIndex?'robot-item-selected':''"
          @click="changeActiveRobot(index, item)">
        <div class="pr-1 flex-1 flex flex-row gap-1 items-center">
          <div
              class="flex-1 text-md leading-8 select-none overflow-hidden overflow-ellipsis whitespace-nowrap"
              :class="item.options.enabled?'max-w-[10rem]':'max-w-[16rem]'">
            {{ item.name }}
          </div>
          <el-tooltip
              :effect="tooltipEffect"
              :content="item.options.model?.toUpperCase()"
              placement="right"
              :hide-after="0"
              :enterable="false">
            <div
                v-if="item.options.enabled"
                class="w-24 overflow-hidden overflow-ellipsis whitespace-nowrap border border-neutral-300 dark:border-neutral-700 rounded px-1 bg-yellow-400 dark:bg-amber-600 text-xs leading-5 select-none"
                @click.stop="editRobotClick(index)">
              <i class="iconfont icon-settings font-normal"/>
              {{ item.options.model?.toUpperCase() }}
            </div>
          </el-tooltip>
        </div>
        <el-popover overlayClassName="robot-editor-popover" placement="bottom" trigger="click">
          <template #default>
            <div class="p-2 m-0">
              <div
                  @click.stop="editRobotClick(index)"
                  class="cursor-pointer rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 leading-6 box-border py-1 px-2 mb-1">
                Edit Chat
              </div>
              <div
                  class="cursor-pointer rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 leading-6 box-border py-1 px-2">
                Delete Chat
              </div>
            </div>
          </template>
          <template #reference>
            <div
                class="robot-control-button flex justify-center items-center hover:bg-neutral-300 dark:hover:bg-neutral-700 w-6 h-6 rounded-md"
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

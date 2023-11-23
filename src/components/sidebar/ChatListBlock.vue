<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, Ref, ref} from "vue";
import {EllipsisOutlined} from "@ant-design/icons-vue";
import EditRobotDialog from "../chat/dialog/EditRobotDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {ChatInfo} from "@/types/Store.ts";
import {useChatListStore} from "@/store/ChatList.ts";
import {useConfigStore} from "@/store/Config.ts";

const instance = getCurrentInstance();
const activeChatInfo = ref<ChatInfo | null>(null);
const changeActiveRobot = (chatInfo: ChatInfo) => {
  if (!instance) return;
  activeChatInfo.value = chatInfo;
  instance.emit('changeChatClick', chatInfo);
};

const chatListStore = useChatListStore();

onMounted(() => {
  const firstChatInfo = chatListStore.chatList[0]
  if (!firstChatInfo) return;
  changeActiveRobot(firstChatInfo);
});

/**
 * Shortcuts configuration.
 */
const configStore = useConfigStore();
const shortcut = computed(() => configStore.shortcut);
const keys = useMagicKeys();
const prevRobotKey = keys[shortcut.value.prevRobot];
whenever(prevRobotKey, () => {
  const prevChatInfo = chatListStore.getPrevChatInfo(activeChatInfo.value);
  if (!prevChatInfo) return;
  changeActiveRobot(prevChatInfo);
});
const nextRobotKey = keys[shortcut.value.nextRobot];
whenever(nextRobotKey, () => {
  const nextChatInfo = chatListStore.getNextChatInfo(activeChatInfo.value);
  if (!nextChatInfo) return;
  changeActiveRobot(nextChatInfo);
});
const switchRobotKey = keys[shortcut.value.switchRobot];
whenever(switchRobotKey, () => {
  const switchChatInfo = chatListStore.getSwitchChatInfo(activeChatInfo.value);
  if (!switchChatInfo) return;
  changeActiveRobot(switchChatInfo);
});

const chatList: Ref<ChatInfo[]> = computed(() => {
  return chatListStore.chatList;
});

const robotListPopoverVisible = ref(false);
const editRobotDialogRefs = ref<InstanceType<typeof EditRobotDialog> | null>(null);
const editRobotClick = (chatInfo: ChatInfo) => {
  if (!editRobotDialogRefs.value) return;
  editRobotDialogRefs.value.show(true, chatInfo);
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
          v-for="(chatInfo, index) in chatList"
          :key="index"
          :class="chatInfo.id === activeChatInfo?.id?'robot-item-selected':''"
          @click="changeActiveRobot(chatInfo)">
        <div class="pr-1 flex-1 flex flex-row gap-1 items-center">
          <div
              class="flex-1 text-md leading-8 select-none overflow-hidden overflow-ellipsis whitespace-nowrap"
              :class="chatInfo.options.enabled?'max-w-[10rem]':'max-w-[16rem]'">
            {{ chatInfo.name }}
          </div>
          <el-tooltip
              v-if="chatInfo.options.enabled"
              :content="chatInfo.options.model.toUpperCase()"
              placement="right"
              :hide-after="0"
              :enterable="false">
            <div
                class="w-24 overflow-hidden overflow-ellipsis whitespace-nowrap border border-neutral-300 dark:border-neutral-700 rounded px-1 bg-yellow-400 dark:bg-amber-600 text-xs leading-5 select-none"
                @click.stop="editRobotClick(chatInfo)">
              <i class="iconfont icon-settings font-normal"/>
              {{ chatInfo.options.model.toUpperCase() }}
            </div>
          </el-tooltip>
        </div>
        <el-popover overlayClassName="robot-editor-popover" placement="bottom" trigger="click">
          <template #default>
            <div class="p-2 m-0">
              <div
                  @click.stop="editRobotClick(chatInfo)"
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

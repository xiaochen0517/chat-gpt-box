<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {ChatInfo} from "@/types/Store.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useAppStateStore} from "@/store/AppStateStore.ts";
import draggable from 'vuedraggable'
import ChatListItem from "@/components/sidebar/ChatListItem.vue";

const appStateStore = useAppStateStore();
const instance = getCurrentInstance();
const activeChatInfo = ref<ChatInfo | null>(null);
const changeActiveRobot = (chatInfo: ChatInfo) => {
  if (!instance) return;
  activeChatInfo.value = chatInfo;
  instance.emit('changeChatClick', chatInfo);
};

const chatListStore = useChatListStore();

onMounted(() => {
  if (appStateStore.currentChatId) {
    activeChatInfo.value = chatListStore.getChatInfo(appStateStore.currentChatId);
  }
  if (!activeChatInfo.value) {
    activeChatInfo.value = chatListStore.chatList[0]
  }
  changeActiveRobot(activeChatInfo.value);
});

/**
 * Shortcuts configuration.
 */
const configStore = useConfigStore();
const shortcut = computed(() => configStore.shortcut);
const keys = useMagicKeys();
const prevRobotKey = keys[shortcut.value.prevRobot];
whenever(prevRobotKey, () => {
  if (!activeChatInfo.value) return;
  const prevChatInfo = chatListStore.getPrevChatInfo(activeChatInfo.value);
  if (!prevChatInfo) return;
  changeActiveRobot(prevChatInfo);
});
const nextRobotKey = keys[shortcut.value.nextRobot];
whenever(nextRobotKey, () => {
  if (!activeChatInfo.value) return;
  const nextChatInfo = chatListStore.getNextChatInfo(activeChatInfo.value);
  if (!nextChatInfo) return;
  changeActiveRobot(nextChatInfo);
});
const switchRobotKey = keys[shortcut.value.switchRobot];
whenever(switchRobotKey, () => {
  if (!activeChatInfo.value) return;
  const switchChatInfo = chatListStore.getSwitchChatInfo(activeChatInfo.value);
  if (!switchChatInfo) return;
  changeActiveRobot(switchChatInfo);
});

const chatList = computed({
  get: () => chatListStore.chatList,
  set: (value) => chatListStore.setChatList(value),
});

type DataInfo = {
  id: number,
  name: string,
}
const otherChatList = ref<DataInfo[]>([
  {
    id: 1,
    name: "Robot 1"
  },
  {
    id: 2,
    name: "Robot 2"
  },
  {
    id: 3,
    name: "Robot 3"
  },
  {
    id: 4,
    name: "Robot 4"
  },
  {
    id: 5,
    name: "Robot 5"
  }
]);

const robotListRefs = ref<InstanceType<typeof HTMLDivElement> | null>(null);
const scrollToBottom = () => {
  if (!robotListRefs.value) return;
  robotListRefs.value.scrollTop = robotListRefs.value.scrollHeight;
};

defineExpose({
  scrollToBottom
});

const drag = ref(false);
watch(drag, (value) => {
  console.log(value)
});
</script>

<template>
  <div
      ref="robotListRefs"
      class="overflow-hidden overflow-y-auto">
    <div class="min-h-full max-h-0 p-1">
      <el-button type="primary" @click="$router.push({path: '/test'})">Test</el-button>
      <draggable
          class="min-h-full max-h-0 p-1"
          v-model="otherChatList"
          @start="drag=true"
          @end="drag=false"
          item-key="id"
          handle=".handle">
        <template #item="{element}">
          <ChatListItem :chat-info="element" :active-chat-info="activeChatInfo"/>
        </template>
      </draggable>
    </div>
  </div>
</template>

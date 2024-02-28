<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useAppStateStore} from "@/store/AppStateStore.ts";
import draggable from "vuedraggable";
import ChatBotItem from "@/components/sidebar/ChatBotItem.vue";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";

const appStateStore = useAppStateStore();
const instance = getCurrentInstance();
const activeChatInfo = ref<ChatInfo | null>(null);
const changeActiveChat = (chatInfo: ChatInfo) => {
  if (!instance) return;
  activeChatInfo.value = chatInfo;
  instance.emit("changeChatClick", chatInfo);
};

const chatListStore = useChatListStore();

onMounted(() => {
  if (appStateStore.currentChatId) {
    activeChatInfo.value = chatListStore.getChatInfo(appStateStore.currentChatId);
  }
  if (!activeChatInfo.value) {
    activeChatInfo.value = chatListStore.chatList[0];
  }
  changeActiveChat(activeChatInfo.value);
});

/**
 * Shortcuts configuration.
 */
const configStore = useConfigStore();
const shortcutStringConfig = computed(() => configStore.shortcutStringConfig);
const keys = useMagicKeys();
const prevRobotKey = keys[shortcutStringConfig.value.prevRobot];
whenever(prevRobotKey, () => {
  if (!activeChatInfo.value) return;
  const prevChatInfo = chatListStore.getPrevChatInfo(activeChatInfo.value);
  if (!prevChatInfo) return;
  changeActiveChat(prevChatInfo);
});
const nextRobotKey = keys[shortcutStringConfig.value.nextRobot];
whenever(nextRobotKey, () => {
  if (!activeChatInfo.value) return;
  const nextChatInfo = chatListStore.getNextChatInfo(activeChatInfo.value);
  if (!nextChatInfo) return;
  changeActiveChat(nextChatInfo);
});
const switchRobotKey = keys[shortcutStringConfig.value.switchRobot];
whenever(switchRobotKey, () => {
  if (!activeChatInfo.value) return;
  const switchChatInfo = chatListStore.getSwitchChatInfo(activeChatInfo.value);
  if (!switchChatInfo) return;
  changeActiveChat(switchChatInfo);
});

const chatList = computed({
  get: () => chatListStore.chatList,
  set: (value) => chatListStore.setChatList(value),
});

const robotListRefs = ref<InstanceType<typeof HTMLDivElement> | null>(null);
const scrollToBottom = () => {
  if (!robotListRefs.value) return;
  robotListRefs.value.scrollTop = robotListRefs.value.scrollHeight;
};

defineExpose({
  scrollToBottom,
});

const dragStatus = ref(false);
</script>

<template>
  <div class="flex-1 relative w-full h-full">
    <div
        ref="robotListRefs"
        class="absolute w-full h-full overflow-hidden overflow-y-auto"
    >
      <draggable
          class="p-1"
          v-model="chatList"
          item-key="id"
          handle=".handle"
          @start="dragStatus = true"
          @end="dragStatus = false"
          :forceFallback="true"
          ghost-class="ghost-class"
      >
        <template #item="{element}">
          <ChatBotItem
              :chat-info="element"
              :active-chat-info="activeChatInfo"
              :drag="dragStatus"
              @itemClick="changeActiveChat"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped lang="less">
.ghost-class {
  cursor: grabbing !important;
}
</style>

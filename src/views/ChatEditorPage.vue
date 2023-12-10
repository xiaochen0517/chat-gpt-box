<script setup lang="ts">
import {computed, onMounted, Ref, ref} from "vue";
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import router from "@/router/Router.ts";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {ChatType} from "@/types/chat/ChatInfoTypes.ts";
import GPTChatSettingsBlock from "@/components/setting/chat/GPTChatSettingsBlock.vue";
import DALLEChatSettingsBlock from "@/components/setting/chat/DALLEChatSettingsBlock.vue";
import {useChatListStore} from "@/store/ChatListStore.ts";


const route = useRoute();
const chatId: Ref<string | null> = computed(() => {
  let chatId = route.params.chatId;
  if (!chatId) return null;
  if (Array.isArray(chatId)) {
    return chatId[0];
  }
  return chatId;
});
const isAddChat = ref(false);
const chatType = ref(ChatType.CHAT_GPT);
const chatListStore = useChatListStore();
onMounted(() => {
  if (!chatId.value) {
    ElMessage.warning("Please select a chat first");
    jumpToHomePage();
    return;
  }
  isAddChat.value = chatId.value === "add";
  if (isAddChat.value === false) {
    const chatInfo = chatListStore.getChatInfo(chatId.value);
    if (!chatInfo) {
      ElMessage.warning("Get chat info failed");
      jumpToHomePage();
      return;
    }
    chatType.value = chatInfo.chatType;
  }
});

const GPTChatSettingsBlockRefs = ref<typeof GPTChatSettingsBlock | null>(null);
const DALLEChatSettingsBlockRefs = ref<typeof DALLEChatSettingsBlock | null>(null);
const addChat = () => {
  if (chatType.value === ChatType.CHAT_GPT) {
    if (!GPTChatSettingsBlockRefs.value) {
      ElMessage.error("GPTChatSettingsBlockRefs is null!");
      return;
    }
    GPTChatSettingsBlockRefs.value.addChat();
  } else {
    if (!DALLEChatSettingsBlockRefs.value) {
      ElMessage.error("DALLEChatSettingsBlockRefs is null!");
      return;
    }
    DALLEChatSettingsBlockRefs.value.addChat();
  }
};

const jumpToHomePage = () => {
  router.push({path: "/"});
};
</script>

<template>
  <div class="w-full h-full bg-neutral-50 dark:bg-neutral-900">
    <CTopNavBar
        title="Chat Editor"
        :save-button="isAddChat"
        save-button-text="Add"
        @backClick="jumpToHomePage"
        @saveClick="addChat"
    />
    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div
          class="relative flex flex-row gap-2 p-2 rounded-xl overflow-hidden text-base text-center select-none dark:bg-neutral-800"
          :class="{'opacity-40': !isAddChat}"
      >
        <div
            class="tab-background absolute top-2 bottom-2 left-2 w-[calc(50%-0.5rem)] rounded-md shadow-md"
            :class="isAddChat? 'dark:bg-neutral-700':'dark:bg-neutral-700 opacity-40'"
            :style="{transform: chatType === ChatType.CHAT_GPT ? 'translateX(0)' : 'translateX(100%)'}"
        />
        <div
            class="flex-1 px-2 rounded-md text-base leading-8 cursor-pointer z-10"
            :class="{'cursor-not-allowed': !isAddChat}"
            @click.stop="isAddChat && (chatType = ChatType.CHAT_GPT)"
        >
          GPT Chat
        </div>
        <div
            class="flex-1 px-2 rounded-md text-base leading-8 cursor-pointer z-10"
            :class="{'cursor-not-allowed': !isAddChat}"
            @click.stop="isAddChat && (chatType = ChatType.DALL_E)"
        >
          DALL-E
        </div>
      </div>
    </div>
    <Transition name="fade" mode="out-in">
      <GPTChatSettingsBlock
          ref="GPTChatSettingsBlockRefs"
          v-if="chatType === ChatType.CHAT_GPT"
          :is-add-chat="isAddChat"
      />
      <DALLEChatSettingsBlock ref="DALLEChatSettingsBlockRefs" v-else :is-add-chat="isAddChat"/>
    </Transition>
  </div>
</template>

<style lang="less" scoped>
.tab-background {
  transition: all 0.2s ease;
}

/* Enter and leave active styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

/* Enter from and leave to styles (initial/end states) */
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Enter to and leave from styles (final/start states) */
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
<script setup lang="ts">
import {computed, onMounted, Ref, ref, watch} from "vue";
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import router from "@/router/Router.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import StrUtil from "@/utils/StrUtil.ts";
import {ChatInfoTypes, ChatType} from "@/types/chat/ChatInfoTypes.ts";
import GPTChatSettingsBlock from "@/components/setting/chat/GPTChatSettingsBlock.vue";
import DALLEChatSettingsBlock from "@/components/setting/chat/DALLEChatSettingsBlock.vue";

const jumpToHomePage = () => {
  router.push({path: "/"});
};

const chatListStore = useChatListStore();

const route = useRoute();
const chatId: Ref<string | null> = computed(() => {
  let chatId = route.params.chatId;
  if (!chatId) return null;
  if (Array.isArray(chatId)) {
    return chatId[0];
  }
  return chatId;
});
const configEnabled = ref(false);
watch(configEnabled, (value) => {
  if (!chatId.value) return;
  if (chatId.value === "add") {
    addChatInfo.value.options.enabled = value;
    return;
  }
  chatListStore.setChatOptions(chatId.value, "enabled", value);
});
const isAddChat = ref(false);
const chatType = ref(ChatType.CHAT_GPT);
/**
 * If chatId is "add", then we should use addChatInfo.
 */
const addChatInfo = ref<ChatInfoTypes>({
  id: "default",
  name: "Default Chat",
  prompt: "You are a helpful assistant.",
  chatType: ChatType.CHAT_GPT,
  options: {
    enabled: false,
    apiUrl: "https://api.openai.com/",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    contextMaxMessage: 1,
    contextMaxTokens: 2048,
    responseMaxTokens: 0
  }
});

onMounted(() => {
  if (!chatId.value) {
    ElMessage.warning("Please select a chat first");
    router.push({path: "/"});
    return;
  }
  isAddChat.value = chatId.value === "add";
  const chatInfo = chatListStore.getChatInfo(chatId.value);
  configEnabled.value = chatInfo?.options.enabled ?? false;
});

const addChat = () => {
  if (StrUtil.hasEmpty(addChatInfo.value.name, addChatInfo.value.prompt)) {
    ElMessage.error("Chat name and prompt can not be empty!");
    return;
  }
  if (addChatInfo.value.options.enabled && StrUtil.hasEmpty(addChatInfo.value.options.apiUrl)) {
    ElMessage.error("Api url can not be empty!");
    return;
  }
  chatListStore.addChat(addChatInfo.value);
  jumpToHomePage();
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
      <div class="relative flex flex-row gap-2 p-2 rounded-xl overflow-hidden text-base text-center select-none dark:bg-neutral-800">
        <div
            class="tab-background absolute top-2 bottom-2 left-2 w-[calc(50%-0.5rem)] rounded-md dark:bg-neutral-700"
            :style="{transform: chatType === ChatType.CHAT_GPT ? 'translateX(0)' : 'translateX(100%)'}"
        />
        <div
            class="flex-1 px-2 rounded-md text-base leading-8 cursor-pointer z-10"
            @click.stop="chatType = ChatType.CHAT_GPT"
        >
          GPT Chat
        </div>
        <div
            class="flex-1 px-2 rounded-md text-base leading-8 cursor-pointer z-10"
            @click.stop="chatType = ChatType.DALL_E"
        >
          DALL-E Image
        </div>
      </div>
    </div>
    <GPTChatSettingsBlock v-if="chatType === ChatType.CHAT_GPT" :is-add-chat="isAddChat"/>
    <DALLEChatSettingsBlock v-if="chatType === ChatType.DALL_E" :is-add-chat="isAddChat"/>
  </div>
</template>

<style lang="less" scoped>
.tab-background {
  transition: all 0.2s ease;
}
</style>
<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import router from "@/router/Router.ts";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {ChatInfo, ChatOptions, ChatType} from "@/types/chat/ChatInfo.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import CAnimationTabs from "@/components/base/tab/CAnimationTabs.vue";
import DallESettingsList from "@/components/setting/chat/DallESettingsList.vue";
import ChatGptSettingsList from "@/components/setting/chat/ChatGptSettingsList.vue";
import GeminiSettingsList from "@/components/setting/chat/GeminiSettingsList.vue";
import CListItem from "@/components/base/list/CListItem.vue";
import {ChatBaseSettingsDialogUtil} from "@/utils/settings/ChatBaseSettingsDialogUtil.ts";
import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import {
  GoogleGeminiConfig,
  OllamaDefaultConfig,
  OpenAiChatGptConfig,
  OpenAiDallEConfig,
} from "@/types/chat/BaseConfig.ts";
import AvatarEditorDialog from "@/components/chat/dialog/AvatarEditorDialog.vue";
import {IAvatarProps} from "vue3-avataaars";
import OllamaSettingsList from "@/components/setting/chat/OllamaSettingsList.vue";

const route = useRoute();
const chatId: Ref<string | null> = ref(null);
const isAddChat = ref(false);
const chatInfo = ref<ChatInfo>({
  id: "",
  name: "",
  prompt: "",
  chatType: ChatType.CHAT_GPT,
  options: {
    apiUrl: "",
    model: "davinci-instruct-beta",
    temperature: 0.9,
    contextMaxMessage: 2,
    contextMaxTokens: 2048,
    responseMaxTokens: 0,
  } as OpenAiChatGptConfig,
});
const chatListStore = useChatListStore();
const showMoreSettings = ref(false);
onMounted(() => {
  chatId.value = getChatId();
  showMoreSettings.value = true;
  checkChatId();
  isAddChat.value = chatId.value === "add";
  if (isAddChat.value) return;
  const currentChatInfo = chatListStore.getChatInfo(chatId.value ?? "");
  if (!currentChatInfo) {
    if (!isAddChat.value) {
      ElMessage.warning("Chat not found");
      jumpToHomePage();
    }
    return;
  }
  chatInfo.value = currentChatInfo;
  changeChatType(chatInfo.value.chatType);
});
const changeChatType = (chatType: ChatType) => {
  if (chatType === ChatType.CHAT_GPT) {
    activeTabName.value = "GPT";
  } else if (chatType === ChatType.DALL_E) {
    activeTabName.value = "DALL-E";
  } else if (chatType === ChatType.GEMINI) {
    activeTabName.value = "Gemini";
  } else if (chatType === ChatType.OLLAMA) {
    activeTabName.value = "Ollama";
  }
};
const checkChatId = (): boolean => {
  if (!chatId.value) {
    ElMessage.warning("Please select a chat first");
    jumpToHomePage();
    return false;
  }
  return true;
};
const getChatId = (): string | null => {
  let chatId = route.params.chatId;
  if (!chatId) return null;
  if (Array.isArray(chatId)) {
    return chatId[0];
  }
  return chatId;
};

const tabChangeHandle = (name: string) => {
  if (name === "GPT") {
    chatInfo.value.chatType = ChatType.CHAT_GPT;
  } else if (name === "DALL-E") {
    chatInfo.value.chatType = ChatType.DALL_E;
  } else if (name === "Gemini") {
    chatInfo.value.chatType = ChatType.GEMINI;
  } else if (name === "Ollama") {
    chatInfo.value.chatType = ChatType.OLLAMA;
  }
};

const jumpToHomePage = () => {
  router.back();
};

const tabNames = ref(["GPT", "DALL-E", "Gemini", "Ollama"]);
const activeTabName = ref("GPT");
const settingsDialogRefs = ref<InstanceType<typeof CBaseDialog> | null>(null);
const avatarEditorDialogRefs = ref<InstanceType<typeof AvatarEditorDialog> | null>(null);
const openAvatarDialog = () => {
  if (!avatarEditorDialogRefs.value) return;
  avatarEditorDialogRefs.value.show(chatInfo.value.avatar)
      .then((value: IAvatarProps) => {
        chatInfo.value.avatar = value;
        if (!isAddChat.value) {
          chatListStore.setChatInfo(chatId.value ?? "", "avatar", value);
        }
        avatarEditorDialogRefs.value?.hide();
      })
      .catch(() => {
      });
};
const openChatNameDialog = () => {
  if (!settingsDialogRefs.value) return;
  ChatBaseSettingsDialogUtil.showChatNameDialog(settingsDialogRefs.value, chatInfo.value.name)
      .then((value: string | number) => {
        if (!settingsDialogRefs.value) return;
        value = String(value);
        if (isAddChat.value) {
          chatInfo.value.name = value;
        } else {
          chatListStore.setChatInfo(chatId.value ?? "", "name", value);
        }
        settingsDialogRefs.value.hide();
      });
};
const openChatPromptDialog = () => {
  if (!settingsDialogRefs.value) return;
  ChatBaseSettingsDialogUtil.showChatPromptDialog(settingsDialogRefs.value, chatInfo.value.prompt)
      .then((value: string | number) => {
        if (!settingsDialogRefs.value) return;
        value = String(value);
        if (isAddChat.value) {
          chatInfo.value.prompt = value;
        } else {
          chatListStore.setChatInfo(chatId.value ?? "", "prompt", value);
        }
        settingsDialogRefs.value.hide();
      });
};

const addChat = () => {
  if (!checkChatId()) return;
  if (!chatInfo.value.name || chatInfo.value.name === "") {
    ElMessage.warning("Please enter the chat name");
    return;
  }
  if (chatInfo.value.chatType !== ChatType.DALL_E && (!chatInfo.value.prompt || chatInfo.value.prompt === "")) {
    ElMessage.warning("Please enter the chat prompt");
    return;
  }
  let chatOptions = getChatOptionsFromSettingsList();
  if (!chatOptions) {
    ElMessage.warning("Please check the chat settings");
    return;
  }
  chatInfo.value.options = chatOptions;
  chatListStore.addChat(chatInfo.value);
  jumpToHomePage();
};
const chatGptSettingsListRefs = ref<InstanceType<typeof ChatGptSettingsList> | null>(null);
const dallESettingsListRefs = ref<InstanceType<typeof DallESettingsList> | null>(null);
const geminiSettingsListRefs = ref<InstanceType<typeof GeminiSettingsList> | null>(null);
const ollamaSettingsListRefs = ref<InstanceType<typeof OllamaSettingsList> | null>(null);
const getChatOptionsFromSettingsList = (): ChatOptions | null => {
  if (activeTabName.value === "GPT") {
    return chatGptSettingsListRefs.value?.getConfig() as OpenAiChatGptConfig;
  } else if (activeTabName.value === "DALL-E") {
    return dallESettingsListRefs.value?.getConfig() as OpenAiDallEConfig;
  } else if (activeTabName.value === "Gemini") {
    return geminiSettingsListRefs.value?.getConfig() as GoogleGeminiConfig;
  } else if (activeTabName.value === "Ollama") {
    return ollamaSettingsListRefs.value?.getConfig() as OllamaDefaultConfig;
  }
  return null;
};
</script>

<template>
  <div class="w-full h-screen bg-neutral-50 dark:bg-neutral-900 overflow-y-auto">
    <CTopNavBar
        :title="$t('chat.chatSettings.pageTitle')"
        :save-button="isAddChat"
        save-button-text="Add"
        @backClick="jumpToHomePage"
        @saveClick="addChat"
    />
    <div class="px-2 xl:p-0 max-w-content m-auto pt-2 pb-6">
      <div class="mt-1 text-lg leading-13">{{ $t("settings.basicSettings") }}</div>
      <div class="mb-4 rounded-md overflow-hidden text-base select-none border dark:border-0 bg-neutral-100 dark:bg-neutral-800">
        <CListItem
            :content="!chatInfo.name || chatInfo.name === '' ? $t('chat.chatName.emptyHint') : chatInfo.name"
            :left-avatar="chatInfo.avatar"
            @click="openChatNameDialog"
            @avatarClick="openAvatarDialog"
            :bottom-border="activeTabName !== 'DALL-E'"
        />
        <CListItem
            v-if="activeTabName !== 'DALL-E'"
            :content="$t('chat.chatPrompt.title')"
            left-icon="iconfont icon-message-comments"
            :bottom-border="false"
            @click="openChatPromptDialog"
        />
      </div>
      <CAnimationTabs
          v-model:active-name="activeTabName"
          :tab-names="tabNames"
          @change="tabChangeHandle"
          :disabled="!isAddChat"
      />
      <div v-if="showMoreSettings" class="pt-4 overflow-hidden">
        <Transition name="slip" mode="out-in">
          <ChatGptSettingsList
              v-if="activeTabName === 'GPT'"
              ref="chatGptSettingsListRefs"
              :chat-id="chatId"
              no-default
          />
          <DallESettingsList
              v-else-if="activeTabName === 'DALL-E'"
              ref="dallESettingsListRefs"
              :chat-id="chatId"
              no-default
          />
          <GeminiSettingsList
              v-else-if="activeTabName === 'Gemini'"
              ref="geminiSettingsListRefs"
              :chat-id="chatId"
              no-default
          />
          <OllamaSettingsList
              v-else-if="activeTabName === 'Ollama'"
              ref="ollamaSettingsListRefs"
              :chat-id="chatId"
              no-default
          />
        </Transition>
      </div>
    </div>
    <CBaseDialog ref="settingsDialogRefs"/>
    <AvatarEditorDialog ref="avatarEditorDialogRefs"/>
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
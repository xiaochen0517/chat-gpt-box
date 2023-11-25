<script setup lang="ts">
import {computed, defineComponent, markRaw, nextTick, onMounted, Ref, ref, watch} from "vue";
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import ApiKeyDialog from "@/components/setting/dialog/ApiKeyDialog.vue";
import TemperatureDialog from "@/components/setting/dialog/TemperatureDialog.vue";
import ResponseMaxTokensDialog from "@/components/setting/dialog/ResponseMaxTokensDialog.vue";
import ContextMaxMsgsDialog from "@/components/setting/dialog/ContextMaxMsgsDialog.vue";
import ContextMaxTokensDialog from "@/components/setting/dialog/ContextMaxTokensDialog.vue";
import ApiUrlDialog from "@/components/setting/dialog/ApiUrlDialog.vue";
import ModelDialog from "@/components/setting/dialog/ModelDialog.vue";
import ChatNameDialog from "@/components/setting/dialog/ChatNameDialog.vue";
import ChatPromptDialog from "@/components/setting/dialog/ChatPromptDialog.vue";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {ChatInfo, ChatOptions} from "@/types/Store.ts";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import StrUtil from "@/utils/StrUtil.ts";

const jumpToHomePage = () => {
  router.push({path: "/"});
}

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
/**
 * If chatId is "add", then we should use addChatInfo.
 */
const addChatInfo = ref<ChatInfo>({
  id: "default",
  name: "Default Chat",
  prompt: "You are a helpful assistant.",
  options: {
    enabled: false,
    apiUrl: "https://api.openai.com/",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    context_max_message: 1,
    context_max_tokens: 2048,
    response_max_tokens: 0
  }
});
const chatInfo = computed(() => {
  if (!chatId.value || chatId.value === "add") {
    return addChatInfo.value;
  }
  return chatListStore.getChatInfo(chatId.value);
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
})

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
}

type ComponentMap = {
  [key: string]: ReturnType<typeof defineComponent>;
};

const components: ComponentMap = {
  ApiKeyDialog,
  ApiUrlDialog,
  ModelDialog,
  TemperatureDialog,
  ContextMaxMsgsDialog,
  ContextMaxTokensDialog,
  ResponseMaxTokensDialog,
  ChatNameDialog,
  ChatPromptDialog,
}

const currentDialogRefs = ref<any>(null);
const currentDialog = ref<string | ReturnType<typeof defineComponent>>("");
const openBaseDialog = (name: string, key: keyof ChatInfo) => {
  if (!components[name]) return;
  currentDialog.value = markRaw(components[name]);
  nextTick(() => {
    if (!currentDialogRefs.value) return;
    if (!chatInfo.value) return;
    currentDialogRefs.value.show(chatInfo.value[key]);
  })
}
const openOptionsDialog = (name: string, key: keyof ChatOptions) => {
  if (!components[name]) return;
  currentDialog.value = markRaw(components[name]);
  nextTick(() => {
    if (!currentDialogRefs.value) return;
    if (!chatInfo.value) return;
    currentDialogRefs.value.show(chatInfo.value.options[key]);
  })
}

const saveChatOptions = <K extends keyof ChatOptions>(key: K, value: ChatOptions[K]) => {
  if (!chatId.value) return;
  if (!currentDialogRefs.value) return;
  if (isAddChat.value) {
    addChatInfo.value.options[key] = value;
  } else {
    chatListStore.setChatOptions(chatId.value, key, value);
  }
  currentDialogRefs.value.hide();
}

const saveChatInfo = <K extends keyof ChatInfo>(key: K, value: ChatInfo[K]) => {
  if (!chatId.value) return;
  if (!currentDialogRefs.value) return;
  if (isAddChat.value) {
    addChatInfo.value[key] = value;
  } else {
    chatListStore.setChatInfo(chatId.value, key, value);
  }
  currentDialogRefs.value.hide();
}
</script>

<template>
  <div class="w-full h-full bg-neutral-50 dark:bg-neutral-900">
    <CTopNavBar
        title="Chat Editor"
        :save-button="isAddChat"
        save-button-text="Add"
        @backClick="jumpToHomePage"
        @saveClick="addChat"/>
    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">Basic Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none">
        <CListItem
            content="Chat name"
            left-icon="icon-discount"
            @click.stop="openBaseDialog('ChatNameDialog', 'name')"/>
        <CListItem
            content="Chat prompt"
            left-icon="icon-product-list"
            @click.stop="openBaseDialog('ChatPromptDialog', 'prompt')"/>
        <CListItem
            content="Advanced Settings"
            left-icon="icon-settings"
            switch-enabled
            v-model:switch-value="configEnabled"
            :bottom-border="false"/>
      </div>
      <div v-if="configEnabled" class="mt-1 text-lg leading-13">Advanced Settings</div>
      <div
          v-if="configEnabled"
          class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
        <CListItem content="Api url" left-icon="icon-link1" @click.stop="openOptionsDialog('ApiUrlDialog', 'apiUrl')"/>
        <CListItem content="Model" left-icon="icon-connections" @click="openOptionsDialog('ModelDialog', 'model')"/>
        <CListItem
            content="Temperature"
            left-icon="icon-hot-for-ux"
            @click="openOptionsDialog('TemperatureDialog', 'temperature')"/>
        <CListItem
            content="Context max msgs"
            left-icon="icon-file-text"
            @click="openOptionsDialog('ContextMaxMsgsDialog', 'context_max_message')"/>
        <CListItem
            content="Context max tokens"
            left-icon="icon-translate"
            @click="openOptionsDialog('ContextMaxTokensDialog', 'context_max_tokens')"/>
        <CListItem
            content="Response max tokens"
            left-icon="icon-rollback"
            :bottom-border="false"
            @click="openOptionsDialog('ResponseMaxTokensDialog', 'response_max_tokens')"/>
      </div>
    </div>
    <Component
        ref="currentDialogRefs"
        :is="currentDialog"
        v-if="currentDialog"
        @commit="saveChatOptions"
        @save="saveChatInfo"/>
  </div>
</template>
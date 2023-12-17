<script setup lang="ts">
import {computed, defineComponent, markRaw, nextTick, onMounted, Ref, ref, watch} from "vue";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import TemperatureDialog from "@/components/setting/dialog/gpt/TemperatureDialog.vue";
import ResponseMaxTokensDialog from "@/components/setting/dialog/gpt/ResponseMaxTokensDialog.vue";
import ContextMaxMsgsDialog from "@/components/setting/dialog/gpt/ContextMaxMsgsDialog.vue";
import ContextMaxTokensDialog from "@/components/setting/dialog/gpt/ContextMaxTokensDialog.vue";
import ApiUrlDialog from "@/components/setting/dialog/ApiUrlDialog.vue";
import GPTModelDialog from "@/components/setting/dialog/gpt/GPTModelDialog.vue";
import ChatNameDialog from "@/components/setting/dialog/ChatNameDialog.vue";
import ChatPromptDialog from "@/components/setting/dialog/gpt/ChatPromptDialog.vue";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {ChatInfoTypes, ChatType, GPTChatOptions} from "@/types/chat/ChatInfoTypes.ts";


const chatListStore = useChatListStore();

type Props = {
  isAddChat: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  isAddChat: true,
});

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
    defaultGptChatInfo.value.options.enabled = value;
    return;
  }
  chatListStore.setChatOptions(chatId.value, "enabled", value);
});
/**
 * If chatId is "add", then we should use addChatInfo.
 */
const defaultGptChatInfo = ref<ChatInfoTypes>({
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
  } as GPTChatOptions
});
const chatInfo = computed(() => {
  if (!chatId.value || chatId.value === "add") {
    return defaultGptChatInfo.value;
  }
  return chatListStore.getChatInfo(chatId.value);
});

onMounted(() => {
  if (!chatId.value) {
    ElMessage.warning("Please select a chat first");
    router.push({path: "/"});
    return;
  }
  const chatInfo = chatListStore.getChatInfo(chatId.value);
  configEnabled.value = chatInfo?.options.enabled ?? false;
});

type ComponentMap = {
  [key: string]: ReturnType<typeof defineComponent>;
};

const components: ComponentMap = {
  ApiUrlDialog,
  GPTModelDialog,
  TemperatureDialog,
  ContextMaxMsgsDialog,
  ContextMaxTokensDialog,
  ResponseMaxTokensDialog,
  ChatNameDialog,
  ChatPromptDialog,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentDialogRefs = ref<any>(null);
const currentDialog = ref<string | ReturnType<typeof defineComponent>>("");
const openBaseDialog = (name: string, key: keyof ChatInfoTypes) => {
  if (!components[name]) return;
  currentDialog.value = markRaw(components[name]);
  nextTick(() => {
    if (!currentDialogRefs.value) return;
    if (!chatInfo.value) return;
    currentDialogRefs.value.show(chatInfo.value[key]);
  });
};
const openOptionsDialog = (name: string, key: keyof GPTChatOptions) => {
  if (!components[name]) return;
  currentDialog.value = markRaw(components[name]);
  nextTick(() => {
    if (!currentDialogRefs.value) return;
    if (!chatInfo.value) return;
    currentDialogRefs.value.show((defaultGptChatInfo.value.options as GPTChatOptions)[key]);
  });
};

const saveChatOptions = <K extends keyof GPTChatOptions>(key: K, value: GPTChatOptions[K]) => {
  if (!chatId.value) return;
  if (!currentDialogRefs.value) return;
  if (props.isAddChat) {
    (defaultGptChatInfo.value.options as GPTChatOptions)[key] = value;
  } else {
    chatListStore.setGPTChatOptions(chatId.value, key, value);
  }
  currentDialogRefs.value.hide();
};

const saveChatInfo = <K extends keyof ChatInfoTypes>(key: K, value: ChatInfoTypes[K]) => {
  if (!chatId.value) return;
  if (!currentDialogRefs.value) return;
  if (props.isAddChat) {
    defaultGptChatInfo.value[key] = value;
  } else {
    chatListStore.setChatInfo(chatId.value, key, value);
  }
  currentDialogRefs.value.hide();
};

const addChat = () => {
  if (!chatId.value) return;
  if (!props.isAddChat) return;
  chatListStore.addChat(defaultGptChatInfo.value);
  jumpToHomePage();
};
const jumpToHomePage = () => {
  router.push({path: "/"});
};

defineExpose({
  addChat,
});
</script>

<template>
  <div>
    <div class="px-2 xl:p-0 max-w-content m-auto mt-2">
      <div class="mt-1 text-lg leading-13">Basic Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none">
        <CListItem
            content="Chat name"
            left-icon="icon-discount"
            @click.stop="openBaseDialog('ChatNameDialog', 'name')"
        />
        <CListItem
            content="Chat prompt"
            left-icon="icon-product-list"
            @click.stop="openBaseDialog('ChatPromptDialog', 'prompt')"
        />
        <CListItem
            content="Advanced Settings"
            left-icon="icon-settings"
            switch-enabled
            v-model:switch-value="configEnabled"
            :bottom-border="false"
        />
      </div>
      <div v-if="configEnabled" class="mt-1 text-lg leading-13">Advanced Settings</div>
      <div
          v-if="configEnabled"
          class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800"
      >
        <CListItem content="Api url" left-icon="icon-link1" @click.stop="openOptionsDialog('ApiUrlDialog', 'apiUrl')"/>
        <CListItem content="Model" left-icon="icon-connections" @click="openOptionsDialog('GPTModelDialog', 'model')"/>
        <CListItem
            content="Temperature"
            left-icon="icon-hot-for-ux"
            @click="openOptionsDialog('TemperatureDialog', 'temperature')"
        />
        <CListItem
            content="Context max msgs"
            left-icon="icon-file-text"
            @click="openOptionsDialog('ContextMaxMsgsDialog', 'contextMaxMessage')"
        />
        <CListItem
            content="Context max tokens"
            left-icon="icon-translate"
            @click="openOptionsDialog('ContextMaxTokensDialog', 'contextMaxTokens')"
        />
        <CListItem
            content="Response max tokens"
            left-icon="icon-rollback"
            :bottom-border="false"
            @click="openOptionsDialog('ResponseMaxTokensDialog', 'responseMaxTokens')"
        />
      </div>
    </div>
    <Component
        ref="currentDialogRefs"
        :is="currentDialog"
        v-if="currentDialog"
        :chat-info="chatInfo"
        @saveOption="saveChatOptions"
        @save="saveChatInfo"
    />
  </div>
</template>
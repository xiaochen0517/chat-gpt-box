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
import {useChatListStore} from "@/store/ChatListStore.ts";
import {ChatInfo, ChatOptions} from "@/types/Store.ts";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const jumpToHomePage = () => {
  router.push({path: "/"});
}

// TODO: add chat editor page
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

onMounted(() => {
  if (!chatId.value) {
    ElMessage.warning("Please select a chat first");
    router.push({path: "/"});
    return;
  }
  if (chatId.value === "add") {
    isAddChat.value = true;
    return;
  }
  const chatInfo = chatListStore.getChatInfo(chatId.value);
  configEnabled.value = chatInfo?.options.enabled ?? false;
})

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
}

const currentDialogRefs = ref<any>(null);
const currentDialog = ref<string | ReturnType<typeof defineComponent>>("");
const openDialog = (name: string) => {
  if (!components[name]) return;
  currentDialog.value = markRaw(components[name]);
  nextTick(() => {
    if (!currentDialogRefs.value) return;
    currentDialogRefs.value.show();
  })
}

const saveConfig = (key: keyof ChatOptions, value: any) => {
  if (!chatId.value) return;
  chatListStore.setChatOptions(chatId.value, key, value);
  if (!currentDialogRefs.value) return;
  currentDialogRefs.value.hide();
}
</script>

<template>
  <div class="w-full h-full bg-neutral-50 dark:bg-neutral-900">
    <CTopNavBar title="Chat Editor" @backClick="jumpToHomePage"/>
    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">Basic Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none">
        <CListItem content="Api url" left-icon="icon-link1" @click.stop="openDialog('ApiUrlDialog')"/>
        <CListItem
            content="Dark Mode"
            left-icon="icon-night-mode"
            switch-enabled
            v-model:switch-value="configEnabled"
            :bottom-border="false"/>
      </div>
      <div v-if="configEnabled" class="mt-1 text-lg leading-13">Advanced Settings</div>
      <div
          v-if="configEnabled"
          class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
        <CListItem content="Default Model" left-icon="icon-connections" @click="openDialog('ModelDialog')"/>
        <CListItem content="Temperature" left-icon="icon-hot-for-ux" @click="openDialog('TemperatureDialog')"/>
        <CListItem content="Context max msgs" left-icon="icon-file-text" @click="openDialog('ContextMaxMsgsDialog')"/>
        <CListItem
            content="Context max tokens"
            left-icon="icon-translate"
            @click="openDialog('ContextMaxTokensDialog')"/>
        <CListItem
            content="Response max tokens"
            left-icon="icon-rollback"
            :bottom-border="false"
            @click="openDialog('ResponseMaxTokensDialog')"/>
      </div>
    </div>
    <Component ref="currentDialogRefs" :is="currentDialog" v-if="currentDialog" @commit="saveConfig"/>
  </div>
</template>
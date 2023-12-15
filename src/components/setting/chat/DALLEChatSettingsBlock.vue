<script setup lang="ts">
import {computed, defineComponent, markRaw, nextTick, onMounted, Ref, ref} from "vue";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import ApiKeyDialog from "@/components/setting/dialog/ApiKeyDialog.vue";
import ApiUrlDialog from "@/components/setting/dialog/ApiUrlDialog.vue";
import DALLEModelDialog from "@/components/setting/dialog/dalle/DALLEModelDialog.vue";
import ChatNameDialog from "@/components/setting/dialog/ChatNameDialog.vue";
import ImageCountDialog from "@/components/setting/dialog/dalle/ImageCountDialog.vue";
import ImageQualityDialog from "@/components/setting/dialog/dalle/ImageQualityDialog.vue";
import ImageSizeDialog from "@/components/setting/dialog/dalle/ImageSizeDialog.vue";
import ImageStyleDialog from "@/components/setting/dialog/dalle/ImageStyleDialog.vue";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {ChatInfoTypes, ChatType, DallEChatOptions} from "@/types/chat/ChatInfoTypes.ts";


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
/**
 * If chatId is "add", then we should use default chat info.
 */
const defaultDallEChatInfo = ref<ChatInfoTypes>({
  id: "default",
  name: "Default Chat",
  prompt: "",
  chatType: ChatType.DALL_E,
  options: {
    enabled: true,
    apiUrl: "https://api.openai.com/",
    model: "dall-e-3",
    imageCount: 1,
    imageSize: "1024x1024",
    imageStyle: "vivid",
    imageQuality: "standard",
  } as DallEChatOptions
});
const chatInfo = computed(() => {
  if (!chatId.value || chatId.value === "add") {
    return defaultDallEChatInfo.value;
  }
  return chatListStore.getChatInfo(chatId.value);
});

onMounted(() => {
  if (!chatId.value) {
    ElMessage.warning("Please select a chat first");
    router.push({path: "/"});
    return;
  }
});

type ComponentMap = {
  [key: string]: ReturnType<typeof defineComponent>;
};

const components: ComponentMap = {
  ApiKeyDialog,
  ApiUrlDialog,
  DALLEModelDialog,
  ChatNameDialog,
  ImageCountDialog,
  ImageQualityDialog,
  ImageSizeDialog,
  ImageStyleDialog,
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
const openOptionsDialog = (name: string, key: keyof DallEChatOptions) => {
  if (!components[name]) return;
  currentDialog.value = markRaw(components[name]);
  nextTick(() => {
    if (!currentDialogRefs.value) return;
    if (!chatInfo.value) return;
    currentDialogRefs.value.show((defaultDallEChatInfo.value.options as DallEChatOptions)[key]);
  });
};

const saveChatOptions = <K extends keyof DallEChatOptions>(key: K, value: DallEChatOptions[K]) => {
  if (!chatId.value) return;
  if (!currentDialogRefs.value) return;
  if (props.isAddChat) {
    (defaultDallEChatInfo.value.options as DallEChatOptions)[key] = value;
  } else {
    chatListStore.setDallEChatOptions(chatId.value, key, value);
  }
  currentDialogRefs.value.hide();
};

const saveChatInfo = <K extends keyof ChatInfoTypes>(key: K, value: ChatInfoTypes[K]) => {
  if (!chatId.value) return;
  if (!currentDialogRefs.value) return;
  if (props.isAddChat) {
    defaultDallEChatInfo.value[key] = value;
  } else {
    chatListStore.setChatInfo(chatId.value, key, value);
  }
  currentDialogRefs.value.hide();
};

const addChat = () => {
  if (!chatId.value) return;
  if (!props.isAddChat) return;
  chatListStore.addChat(defaultDallEChatInfo.value);
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
    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">Basic Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none">
        <CListItem
            content="Chat name"
            left-icon="icon-discount"
            @click.stop="openBaseDialog('ChatNameDialog', 'name')"
        />
        <CListItem content="Api url" left-icon="icon-link1" @click.stop="openOptionsDialog('ApiUrlDialog', 'apiUrl')"/>
        <CListItem
            content="Model"
            left-icon="icon-connections"
            @click="openOptionsDialog('DALLEModelDialog', 'model')"
        />
        <CListItem
            content="Image count"
            left-icon="icon-pictures"
            @click="openOptionsDialog('ImageCountDialog', 'temperature')"
        />
        <CListItem
            content="Image size"
            left-icon="icon-arrawsalt"
            @click="openOptionsDialog('ImageSizeDialog', 'contextMaxMessage')"
        />
        <CListItem
            content="Image style"
            left-icon="icon-expand"
            @click="openOptionsDialog('ImageStyleDialog', 'contextMaxTokens')"
        />
        <CListItem
            content="Image quality"
            left-icon="icon-scenes"
            :bottom-border="false"
            @click="openOptionsDialog('ImageQualityDialog', 'responseMaxTokens')"
        />
      </div>
    </div>
    <Component
        ref="currentDialogRefs"
        :is="currentDialog"
        v-if="currentDialog"
        :chat-info="chatInfo"
        @commit="saveChatOptions"
        @save="saveChatInfo"
    />
  </div>
</template>
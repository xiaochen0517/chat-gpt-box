<script setup lang="ts">
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ref} from "vue";
import {ChatInfo, ChatType} from "@/types/chat/ChatInfo.ts";
import {OpenAiChatGptConfig} from "@/types/chat/BaseConfig.ts";
import {Avatar} from "vue3-avataaars";
import i18n from "@/i18n/i18n.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {ElMessage} from "element-plus";
import {AvatarUtil} from "@/utils/AvatarUtil.ts";

const {t} = i18n.global;
const avatarFactory = ref(AvatarUtil.getDefaultAvatar());
const dialogVisible = ref(false);
const templateInfo = ref<ChatInfo>({
  id: "",
  name: "",
  prompt: "",
  chatType: ChatType.CHAT_GPT,
  options: {
    apiUrl: "",
    model: "",
    temperature: 0.7,
    contextMaxMessage: 0,
    contextMaxTokens: 0,
    responseMaxTokens: 0,
  } as OpenAiChatGptConfig,
});
const show = (chatInfo: ChatInfo) => {
  templateInfo.value = chatInfo;
  avatarFactory.value = AvatarUtil.initDefaultAvatar(chatInfo.avatar);
  dialogVisible.value = true;
};
defineExpose({
  show,
});

const chatListStore = useChatListStore();
const addChat = () => {
  chatListStore.addChat(templateInfo.value);
  ElMessage.success(t("chatTemplate.messages.addSuccess"));
  dialogVisible.value = false;
};
</script>

<template>
  <CDialog
      v-model:visible="dialogVisible"
      :title="templateInfo.name"
      :ok-text="t('dialog.add')"
      :cancel-text="t('dialog.cancel')"
      @okClick="addChat"
      @cancelClick="dialogVisible = false"
  >
    <div class="w-full flex flex-col gap-2 items-center">
      <Avatar class="w-32 h-32 rounded-full overflow-hidden bg-gray-600" v-bind="avatarFactory"/>
      <div class="my-2 bg-amber-400 dark:bg-amber-600 shadow-md rounded px-2 py-1 text-sm font-bold text-black">
        {{ templateInfo.chatType.toUpperCase() }}
      </div>
      <div class="w-10/12 mb-2 text-base rounded-md bg-neutral-700 px-2 py-1">{{ templateInfo.prompt }}</div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import router from "@/router/Router.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {ChatInfo, ChatType} from "@/types/chat/ChatInfo.ts";
import {computed, onMounted, ref} from "vue";
import {GoogleGeminiConfig, OpenAiChatGptConfig, OpenAiDallEConfig} from "@/types/chat/BaseConfig.ts";
import {Avatar, IAvatarProps} from "vue3-avataaars";
import {ChatDialogUtil} from "@/utils/dialog/ChatDialogUtil.ts";
import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import {AvatarUtil} from "@/utils/AvatarUtil.ts";

type Props = {
  chatInfo: ChatInfo | null,
  activeChatInfo: ChatInfo | null,
  drag: boolean
}

const props = withDefaults(defineProps<Props>(), {
  chatInfo: null,
  activeChatInfo: null,
  drag: false,
});
const modelName = ref("");
const avatarInfo = ref<IAvatarProps>(AvatarUtil.getDefaultAvatar());
onMounted(() => {
  if (!props.chatInfo) {
    modelName.value = "NONE";
    return;
  }
  switch (props.chatInfo.chatType) {
    case ChatType.CHAT_GPT:
      modelName.value = (props.chatInfo.options as OpenAiChatGptConfig).model;
      break;
    case ChatType.DALL_E:
      modelName.value = (props.chatInfo.options as OpenAiDallEConfig).model;
      break;
    case ChatType.GEMINI:
      modelName.value = (props.chatInfo.options as GoogleGeminiConfig).model;
      break;
  }
  avatarInfo.value = AvatarUtil.initDefaultAvatar(props.chatInfo.avatar);
});

const editChatClick = (chatInfo: ChatInfo | null) => {
  if (!chatInfo) return;
  router.push({path: `/chat/editor/${chatInfo.id}`});
};

const chatListStore = useChatListStore();
const baseDialogRefs = ref<InstanceType<typeof CBaseDialog> | null>(null);
const deleteChatClick = (chatInfo: ChatInfo | null) => {
  if (!chatInfo || !baseDialogRefs.value) return;
  ChatDialogUtil.showDeleteChatDialog(baseDialogRefs.value)
      .then(() => {
        chatListStore.deleteChat(chatInfo.id);
      })
      .catch(() => {
      });
};

const isActive = computed(() => {
  return props.chatInfo && props.activeChatInfo && props.chatInfo.id === props.activeChatInfo.id;
});
</script>

<template>
  <div
      class="flex flex-row items-center relative w-full p-1.5 mb-1 rounded-xl cursor-pointer dark:hover:bg-neutral-700 dark:hover:bg-opacity-30"
      :class="{'bg-neutral-700 bg-opacity-30':isActive}"
      @click="$emit('itemClick', chatInfo)"
  >
    <div class="pr-1 flex-1 flex flex-row">
      <div class="handle rotate-90 mr-2 dark:text-neutral-400" title="Drag to sort" @click.stop>
        <i class="iconfont icon-more text-xl font-bold" :class="drag?'':'cursor-grab'"/>
      </div>
      <Avatar v-if="false" class="w-8 h-8 rounded-full bg-gray-500 mr-2" v-bind="avatarInfo"/>
      <div class="flex-1 relative">
        <span class="absolute left-0 w-full text-md leading-8 select-none overflow-hidden overflow-ellipsis whitespace-nowrap">
          {{ chatInfo?.name }}
        </span>
      </div>
    </div>
    <el-popover overlayClassName="robot-editor-popover" placement="bottom" trigger="click">
      <template #default>
        <div class="p-2 m-0">
          <div
              class="cursor-pointer rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 leading-6 box-border py-1 px-2 mb-1"
              @click.stop="editChatClick(chatInfo)"
          >
            {{ $t("chat.editChat.title") }}
          </div>
          <div
              class="cursor-pointer rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 leading-6 box-border py-1 px-2"
              @click.stop="deleteChatClick(chatInfo)"
          >
            {{ $t("chat.deleteChat.title") }}
          </div>
        </div>
      </template>
      <template #reference>
        <div
            class="flex justify-center items-center w-6 h-6 rounded-md dark:text-neutral-400 dark:hover:text-white"
            @click.stop.prevent=""
        >
          <i class="iconfont icon-more text-xl font-bold"/>
        </div>
      </template>
    </el-popover>
    <CBaseDialog ref="baseDialogRefs"/>
  </div>
</template>

<script setup lang="ts">
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import {ElMessage} from "element-plus";
import i18n from "@/i18n/i18n.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import ChatTemplateInfoDialog from "@/components/chat/dialog/ChatTemplateInfoDialog.vue";
import ChatTemplateTypeLabel from "@/components/chat/block/ChatTemplateTypeLabel.vue";

const {t} = i18n.global;
const configStore = useConfigStore();
const chatTemplateList = ref<ChatInfo[]>([]);

onMounted(() => {
  getChatTemplateList();
});

const getChatTemplateList = () => {
  axios.get(configStore.baseConfig.chatTemplateUrl, {timeout: 5000})
      .then((res) => {
        if (!res || res.status != 200 || !res.data) {
          console.log("get chat template list failed");
          ElMessage.error(t("chatTemplate.messages.getFailed"));
          return;
        }
        chatTemplateList.value = res.data;
      })
      .catch((err) => {
        console.log(err);
        ElMessage.error(t("chatTemplate.messages.getFailed") + ` ${err}`);
      });
};

const chatTemplateInfoDialogRefs = ref<InstanceType<typeof ChatTemplateInfoDialog> | null>(null);
const openAddChatDialog = (chatTemplate: ChatInfo) => {
  console.log(chatTemplate);
  if (!chatTemplateInfoDialogRefs.value) return;
  chatTemplateInfoDialogRefs.value.show(chatTemplate);
};
</script>

<template>
  <div class="w-full h-screen bg-neutral-50 dark:bg-neutral-800 overflow-y-auto">
    <CTopNavBar
        :title="$t('chatTemplate.pageTitle')"
        save-button
        save-button-icon="icon-reload"
        @backClick="$router.back()"
        @saveClick="getChatTemplateList"
    />
    <div class="px-2 xl:p-0 max-w-3xl m-auto pt-2 pb-6">
      <div class="mt-1 text-lg leading-13">{{ $t("chatTemplate.chatTemplateList") }}</div>
      <div class="rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-2 flex flex-col gap-2 overflow-hidden text-base select-none border dark:border-0">
        <CListItem
            v-for="(chatTemplate, index) in chatTemplateList"
            :key="chatTemplate.name"
            :left-avatar="chatTemplate.avatar"
            :content="chatTemplate.name"
            :bottom-border="index < chatTemplateList.length - 1"
            @click="openAddChatDialog(chatTemplate)"
        >
          <template #right>
            <ChatTemplateTypeLabel :chat-type="chatTemplate.chatType"/>
          </template>
        </CListItem>
      </div>
    </div>
    <ChatTemplateInfoDialog ref="chatTemplateInfoDialogRefs"/>
  </div>
</template>

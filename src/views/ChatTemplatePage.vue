<script setup lang="ts">
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import {ElMessage} from "element-plus";

const chatTemplateList = ref<ChatInfo[]>([]);

onMounted(() => {
  getChatTemplateList();
});

// const chatTemplateUrl = "https://xiaochen0517.github.io/chat-gpt-box/chat_template.json";
const chatTemplateUrl = "http://localhost:14105/chat_template.json";

const getChatTemplateList = () => {
  axios.get(chatTemplateUrl)
      .then((res) => {
        if (!res || res.status != 200 || !res.data) {
          console.log("get chat template list failed");
          ElMessage.error("Get chat template list failed");
          return;
        }
        chatTemplateList.value = res.data;
        ElMessage.success("Get chat template list success");
      })
      .catch((err) => {
        console.log(err);
        ElMessage.error("Get chat template list failed");
      });
};

const openAddChatDialog = (chatTemplate: ChatInfo) => {
  console.log(chatTemplate);
};
</script>

<template>
  <div class="w-full h-screen bg-neutral-50 dark:bg-neutral-900 overflow-y-auto">
    <CTopNavBar
        :title="$t('chatTemplate.pageTitle')"
        save-button
        save-button-icon="icon-reload"
        @backClick="$router.back()"
        @saveClick="getChatTemplateList"
    />
    <div class="px-2 xl:p-0 max-w-content m-auto pt-2 pb-6">
      <div class="mt-1 text-lg leading-13">{{ $t("chatTemplate.chatTemplateList") }}</div>
      <div class="rounded-xl overflow-hidden text-base select-none border dark:border-0">
        <CListItem
            v-for="(chatTemplate, index) in chatTemplateList"
            :key="chatTemplate.name"
            :left-avatar="chatTemplate.avatar"
            :content="chatTemplate.name"
            :bottom-border="index < chatTemplateList.length - 1"
            @click="openAddChatDialog(chatTemplate)"
        />
      </div>
    </div>
  </div>
</template>
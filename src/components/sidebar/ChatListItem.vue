<script setup lang="ts">
import {EllipsisOutlined} from "@ant-design/icons-vue";
import {ChatInfo} from "@/types/Store.ts";
import router from "@/router/Router.ts";
import {ElMessageBox} from "element-plus";
import {useChatListStore} from "@/store/ChatListStore.ts";

type Props = {
  chatInfo: ChatInfo | null,
  activeChatInfo: ChatInfo | null,
}

const props = withDefaults(defineProps<Props>(), {
  chatInfo: null,
  activeChatInfo: null,
});

const editChatClick = (chatInfo: ChatInfo | null) => {
  if (!chatInfo) return;
  router.push({path: `/chat/editor/${chatInfo.id}`});
};

const chatListStore = useChatListStore();
const deleteChatClick = (chatInfo: ChatInfo | null) => {
  if (!chatInfo) return;
  ElMessageBox.confirm(`Are you sure to delete ${chatInfo.name}?`, "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning"
  }).then(() => {
    chatListStore.deleteChat(chatInfo.id);
  }).catch(() => {
  });
};
</script>

<template>
  <div
      class="flex flex-row items-center relative w-full box-border px-2 py-1 mb-1 rounded-xl hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
      :class="(chatInfo && chatInfo.id === activeChatInfo?.id)?'robot-item-selected':''">
    <div class="pr-1 flex-1 flex flex-row gap-1 items-center">
      <div
          class="flex-1 text-md leading-8 select-none overflow-hidden overflow-ellipsis whitespace-nowrap"
          :class="chatInfo?.options.enabled?'max-w-[10rem]':'max-w-[16rem]'">
        {{ chatInfo?.name }} {{ chatInfo?.id }}
      </div>
      <el-tooltip
          v-if="chatInfo?.options.enabled"
          :content="chatInfo.options.model.toUpperCase()"
          placement="right"
          :hide-after="0"
          :enterable="false">
        <div
            class="w-24 overflow-hidden overflow-ellipsis whitespace-nowrap border border-neutral-300 dark:border-neutral-700 rounded px-1 bg-yellow-400 dark:bg-amber-600 text-xs leading-5"
            @click.stop="editChatClick(chatInfo)">
          <i class="iconfont icon-settings font-normal"/>
          {{ chatInfo.options.model.toUpperCase() }}
        </div>
      </el-tooltip>
    </div>
    <el-popover overlayClassName="robot-editor-popover" placement="bottom" trigger="click">
      <template #default>
        <div class="p-2 m-0">
          <div
              class="cursor-pointer rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 leading-6 box-border py-1 px-2 mb-1"
              @click.stop="editChatClick(chatInfo)">
            Edit Chat
          </div>
          <div
              class="cursor-pointer rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 leading-6 box-border py-1 px-2"
              @click.stop="deleteChatClick(chatInfo)">
            Delete Chat
          </div>
        </div>
      </template>
      <template #reference>
        <div
            class="robot-control-button flex justify-center items-center hover:bg-neutral-300 dark:hover:bg-neutral-700 w-6 h-6 rounded-md"
            @click.stop="">
          <ellipsis-outlined/>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style scoped lang="less">

</style>
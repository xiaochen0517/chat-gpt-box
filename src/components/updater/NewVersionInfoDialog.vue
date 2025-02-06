<script setup lang="ts">

import CDialog from "@/components/base/dialog/CDialog.vue";
import {ref} from "vue";
import MessageMarkdownComponent from "@/components/chat/block/MessageMarkdownComponent.vue";
import UpdateUtil from "@/utils/UpdateUtil.ts";
import {GithubReleaseInfo} from "@/types/base/GithubReleaseInfo.ts";
import logger from "@/utils/logger/Logger.ts";

const latestReleaseInfo = ref<GithubReleaseInfo>({
  id: 0,
  name: "loading...",
  html_url: "",
  tag_name: "",
  body: "",
});

const dialogVisible = ref(false);
const dataLoading = ref(false);
const show = () => {
  dialogVisible.value = true;
  dataLoading.value = true;
  UpdateUtil.getLatestInfo()
      .then((res) => {
        latestReleaseInfo.value = res.data as GithubReleaseInfo;
      })
      .catch((err) => {
        latestReleaseInfo.value.name = "获取更新信息失败";
        latestReleaseInfo.value.body = `获取更新信息失败: \n${err}`;
      })
      .finally(() => {
        dataLoading.value = false;
      });
};
defineExpose({
  show,
});

const jumpToReleasePage = () => {
  let releaseUrl = latestReleaseInfo.value.html_url;
  if (!releaseUrl || releaseUrl.length <= 0) {
    return;
  }
  logger.info("Jump to release page: " + releaseUrl);
  window.open(releaseUrl, "_blank");
  dialogVisible.value = false;
};
</script>

<template>
  <CDialog
      :title="`${$t('updater.title')} - ${latestReleaseInfo.tag_name}`"
      :visible="dialogVisible"
      :cancel-text="$t('updater.cancelUpdate')"
      :ok-text="$t('updater.openReleasePage')"
      :ok-button-loading="dataLoading"
      @okClick="jumpToReleasePage"
  >
    <div class="relative w-full h-60 overflow-y-auto">
      <div class="absolute flex flex-col gap-4 pt-4" v-loading="dataLoading">
        <MessageMarkdownComponent :content="latestReleaseInfo.body + '1\n\n2\n\n3\n\n4\n\n5\n\n6\n\n7\n\n8\n\n9'"/>
      </div>
    </div>
  </CDialog>
</template>

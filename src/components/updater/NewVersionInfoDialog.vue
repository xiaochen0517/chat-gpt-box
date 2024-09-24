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
      :title="latestReleaseInfo.name"
      :visible="dialogVisible"
      :cancel-text="$t('updater.cancelUpdate')"
      :ok-text="$t('updater.openReleasePage')"
      :ok-button-loading="dataLoading"
      @okClick="jumpToReleasePage"
  >
    <div class="flex flex-col gap-2" v-loading="dataLoading">
      <MessageMarkdownComponent :content="latestReleaseInfo.body"/>
    </div>
  </CDialog>
</template>

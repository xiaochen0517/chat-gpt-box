<script setup lang="ts">

import CDialog from "@/components/base/dialog/CDialog.vue";
import {ref} from "vue";
import MessageMarkdownComponent from "@/components/chat/block/MessageMarkdownComponent.vue";
import UpdateUtil from "@/utils/UpdateUtil.ts";
import {GithubReleaseInfo} from "@/types/base/GithubReleaseInfo.ts";

const latestReleaseInfo = ref<GithubReleaseInfo>({
  id: 0,
  name: "none",
  html_url: "",
  tag_name: "",
  body: "",
});

const dialogVisible = ref(false);
const show = () => {
  dialogVisible.value = true;
  UpdateUtil.getLatestInfo()
      .then((res) => {
        latestReleaseInfo.value = res.data as GithubReleaseInfo;
      })
      .catch((err) => {
        latestReleaseInfo.value.name = "获取更新信息失败";
        latestReleaseInfo.value.body = `获取更新信息失败: \n${err}`;
      });
};
defineExpose({
  show,
});

const jumpToReleasePage = () => {
  window.open(latestReleaseInfo.value.html_url);
};
</script>

<template>
  <CDialog
      :title="latestReleaseInfo.name"
      :visible="dialogVisible"
      cancel-text="暂时取消"
      ok-text="下载更新"
      @okClick="jumpToReleasePage"
  >
    <div class="flex flex-col gap-2">
      <MessageMarkdownComponent :content="latestReleaseInfo.body"/>
    </div>
  </CDialog>
</template>

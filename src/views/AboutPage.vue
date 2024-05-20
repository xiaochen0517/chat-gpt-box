<script setup lang="ts">
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import packageJson from "../../package.json";
import CListItem from "@/components/base/list/CListItem.vue";
import {LinkUtil} from "@/utils/LinkUtil.ts";

const jumpToUrl = (url: string) => {
  if (!url) return;
  LinkUtil.openLink(url)
      .then((linkOpenTarget) => {
        console.log("Link opened in", linkOpenTarget);
      })
      .catch((error) => {
        console.error("Error opening link:", error);
      });
};
</script>

<template>
  <div class="w-full h-screen bg-neutral-50 dark:bg-neutral-800 overflow-y-auto">
    <CTopNavBar :title="$t('settings.basic.about.title')" @backClick="$router.back()"/>
    <div class="px-2 3xl:p-0 max-w-3xl m-auto pt-2 pb-6">
      <div class="w-full pt-16 pb-6 flex flex-row items-center justify-center">
        <img src="../../public/icon.png" class="w-20 h-20" alt="logo">
      </div>
      <h1 class="text-center text-xl font-bold">Chat GPT Box</h1>
      <div class="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-2">
        {{ $t("settings.basic.about.description") }}
      </div>
      <div class="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Version {{ packageJson.version }}&nbsp;&nbsp;( Apache License 2.0 )
      </div>
      <div class="bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden mt-6 p-2 flex flex-col gap-2">
        <CListItem
            :content="$t('settings.basic.about.introduction')"
            left-icon="icon-zhuanshuchangjing"
            @click="jumpToUrl($t('settings.basic.about.introductionUrl'))"
        />
        <CListItem
            :content="$t('settings.basic.about.document')"
            left-icon="icon-format-doc"
            @click="jumpToUrl($t('settings.basic.about.documentUrl'))"
        />
        <CListItem
            :content="$t('settings.basic.about.github')"
            left-icon="icon-github"
            @click="jumpToUrl($t('settings.basic.about.githubUrl'))"
        />
        <CListItem
            :content="$t('settings.basic.about.issue')"
            left-icon="icon-message"
            @click="jumpToUrl($t('settings.basic.about.issueUrl'))"
        />
        <CListItem
            :content="$t('settings.basic.about.author')"
            left-icon="icon-code1"
            :bottom-border="false"
            @click="jumpToUrl($t('settings.basic.about.authorUrl'))"
        />
      </div>
    </div>
  </div>
</template>

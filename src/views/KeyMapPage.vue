<script setup lang="ts">
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import KeyMapChangeDialog from "@/components/setting/dialog/KeyMapChangeDialog.vue";
import {computed, ref} from "vue";

import {ShortcutConfigKey} from "@/types/chat/BaseConfig.ts";
import TheKeyMapCode from "@/components/base/list/TheKeyMapCode.vue";

const configStore = useConfigStore();

function backClick() {
  router.back();
}

function resetKeyMap() {
  configStore.resetShortcut();
}

let shortcutSize = computed(() => Object.keys(configStore.shortcut).length);

const KeyMapChangeDialogRefs = ref<InstanceType<typeof KeyMapChangeDialog> | null>(null);

function openKeyMapChangeDialog(shortcutConfigKey: ShortcutConfigKey) {
  if (!KeyMapChangeDialogRefs.value) return;
  KeyMapChangeDialogRefs.value.show(shortcutConfigKey);
}
</script>

<template>
  <div class="w-full min-h-screen bg-neutral-50 dark:bg-neutral-800 overflow-y-auto">
    <CTopNavBar
        title="Key Map"
        saveButton
        saveButtonText="RESET"
        @backClick="backClick"
        @saveClick="resetKeyMap"
    />
    <div class="px-2 xl:p-0 max-w-3xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">KeyMap Settings</div>
      <div class="rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-2 flex flex-col gap-2 overflow-hidden text-base select-none border dark:border-0">
        <CListItem
            v-for="(keyMapList,shortcutKey,index) in configStore.shortcut"
            :key="shortcutKey"
            :show-left-icon="false"
            :content="shortcutKey"
            :bottom-border="index !== shortcutSize - 1"
            @click="openKeyMapChangeDialog(shortcutKey)"
        >
          <template #right>
            <TheKeyMapCode
                v-for="(keyCode,index) in keyMapList"
                :key="index"
                :key-map-code="keyCode"
                :size="75"
            />
          </template>
        </CListItem>
      </div>
    </div>

    <KeyMapChangeDialog ref="KeyMapChangeDialogRefs"/>
  </div>
</template>

<script setup lang="ts">
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import KeyMapChangeDialog from "@/components/setting/dialog/KeyMapChangeDialog.vue";
import {computed, ref} from "vue";
import {ShortcutConfigKey} from "@/types/Store.ts";
import {ArrayUtil} from "@/utils/ArrayUtil.ts";

const configStore = useConfigStore();

function backClick() {
  router.back();
}

function resetKeyMap() {
  configStore.resetShortcut();
}

let shortcutSize = computed(() => Object.keys(configStore.shortcut).length);

const KeyMapChangeDialogRefs = ref<any>(null);

function openKeyMapChangeDialog(shortcutConfigKey: ShortcutConfigKey) {
  KeyMapChangeDialogRefs.value.show(shortcutConfigKey);
}
</script>

<template>
  <div>
    <CTopNavBar title="Key Map" saveButton saveButtonText="reset" @backClick="backClick" @saveClick="resetKeyMap"/>
    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">KeyMap Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
        <CListItem
            v-for="(keyMapList,shortcutKey,index) in configStore.shortcut"
            :key="shortcutKey"
            :content="shortcutKey"
            :right-content="ArrayUtil.formatList2UpperCase(keyMapList)"
            :bottom-border="index !== shortcutSize - 1"
            @click="openKeyMapChangeDialog(shortcutKey)"
        />
      </div>
    </div>

    <KeyMapChangeDialog ref="KeyMapChangeDialogRefs"/>
  </div>
</template>

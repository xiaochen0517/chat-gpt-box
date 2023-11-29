<script setup lang="ts">
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import KeyMapDialog from "@/components/setting/dialog/KeyMapDialog.vue";
import {ref, computed} from "vue";
import {ShortcutConfig} from "@/types/Store.ts";

function backClick() {
  router.back();
}

// 重置快捷键
function resetKeyMap() {
  const configStore = useConfigStore();
  configStore.resetShortcut();
}


const configStore = useConfigStore();
let shortcutLength = computed(() => {
  return Object.keys(configStore.shortcut).length;
})

const KeyMapDialogRefs = ref<any>(null);

function openKeyMapDialog(keyMapItem: keyof ShortcutConfig) {
  KeyMapDialogRefs.value.show(keyMapItem);
}
</script>

<template>
  <div>
    <CTopNavBar title="Key Map" saveButton saveButtonText="reset" @backClick="backClick" @saveClick="resetKeyMap"/>
    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">KeyMap Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
        <CListItem
            v-for="(value,key,index) in configStore.shortcut"
            :key="index"
            :content="key"
            :right-content="value.map(v=>v.toUpperCase())"
            :bottom-border="index !== shortcutLength - 1"
            @click="openKeyMapDialog(key)"
        />
      </div>
    </div>

    <KeyMapDialog ref="KeyMapDialogRefs"/>
  </div>
</template>

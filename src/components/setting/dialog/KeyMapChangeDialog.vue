<script setup lang="ts">
import {computed, ref, watch} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {useMagicKeys} from "@vueuse/core";
import {ShortcutConfigKey} from "@/types/Store.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import {KeyMapUtil} from '@/utils/KeyMapUtil.ts'
import {useConfigStore} from '@/store/ConfigStore.ts'

const showDialog = ref(false);

function initDialog() {
  editedShortcutName.value = null;
  editedKeyMapList.value = [];
  repeatTextShow.value = false;
}

function show(shortcutConfigKey: ShortcutConfigKey) {
  initDialog();
  editedShortcutName.value = shortcutConfigKey;
  showDialog.value = true;
}

function hide() {
  showDialog.value = false;
}

defineExpose({
  show,
  hide
})

// The keyName currently being edited
let editedShortcutName = ref<ShortcutConfigKey | null>(null);
// The keyMapList currently being edited
let editedKeyMapList = ref<string[]>([]);

let {current} = useMagicKeys();
const currentList = computed(() => Array.from(current));
const KeyMapEnumValueList: string[] = Object.values(KeyMapEnum);

// sort the keyMapList
watch(currentList, (list: string[]) => {
  list.forEach((pressedKey: string) => {
    // is not a keyMap
    if (!KeyMapEnumValueList.includes(pressedKey)) return;
    // is already in the keyMapList
    if (editedKeyMapList.value.includes(pressedKey)) return;

    editedKeyMapList.value.push(pressedKey);
  })
  // sort the keyMapList
  editedKeyMapList.value = KeyMapUtil.getKeyMapEnumListBySorted(editedKeyMapList.value as KeyMapEnum[]);
})

let repeatTextShow = ref(false);
const configStore = useConfigStore();

function confirm() {
  if (!editedShortcutName.value) return;

  // select the keyName currently being edited
  let RepeatKeyName = KeyMapUtil.selectShortcutKeyByKeyMapList(editedKeyMapList.value as KeyMapEnum[]);

  if (RepeatKeyName === editedShortcutName.value) {
    hide();
    return;
  }

  // Repeat and no prompt, then prompt once
  if (RepeatKeyName && !repeatTextShow.value) {
    repeatTextShow.value = true;
    return;
  }

  if (RepeatKeyName && repeatTextShow.value) {
    // set Empty
    configStore.setShortcut(RepeatKeyName as ShortcutConfigKey, []);
  }
  
  // not repeat, or prompt has been saved
  configStore.setShortcut(editedShortcutName.value, editedKeyMapList.value as KeyMapEnum[]);
  hide();
}

</script>

<template>
  <CDialog v-model:visible="showDialog" title="New Key" @ok="confirm">
    <div class="flex flex-col w-full">
      <div class="flex justify-center w-full h-14">
        <div v-if="editedKeyMapList.length===0" class="mt-2.5 text-gray-400"> Press any key to set shortcut</div>
        <div class="p-2 m-2 px-4 opacity-80 bg-gray-200 bg-opacity-10 font-bold" v-for="key in editedKeyMapList">
          {{ KeyMapUtil.formatShortcutKeyMap2ShowCode(key) }}
        </div>
      </div>
      <div v-show="repeatTextShow" class="font-bold text-center mt-4">
        Keyboard shortcuts repeat: <span class="text-yellow-600">{{ editedShortcutName }}</span>.
        <div class="mt-2">Do you need to replace it ?</div>
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {useMagicKeys} from "@vueuse/core";
import {ShortcutConfig} from "@/types/Store.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import {KeyMapUtil} from '@/utils/KeyMapUtil.ts'
import {useConfigStore} from '@/store/ConfigStore.ts'

const showDialog = ref(false);

function clearDialog() {
  saveKeyName.value = null;
  saveKeys.value = [];
  showRepeatText.value = false;
}

function show(keyMapItem: keyof ShortcutConfig) {
  clearDialog();
  saveKeyName.value = keyMapItem;
  showDialog.value = true;
}

function hide() {
  showDialog.value = false;
}

defineExpose({
  show,
  hide
})

// 当前正在记录的快捷键名称
let saveKeyName = ref<keyof ShortcutConfig | null>(null);
// 当前正在记录的快捷键
let saveKeys = ref<KeyMapEnum[]>([]);

let {current} = useMagicKeys();
const currentKeys = computed(() => Array.from(current));
// 监听当前按下的快捷键,并且去重、排序
watch(currentKeys, (keyDownValueList: any[]) => {
  keyDownValueList.forEach((keyDownValue: any) => {
    // 如果不是预设键
    if (!Object.values(KeyMapEnum).includes(keyDownValue)) return;
    // 如果已经存在了
    if (saveKeys.value.includes(keyDownValue)) return;

    saveKeys.value.push(keyDownValue);
  })
  // 排序
  saveKeys.value = KeyMapUtil.sortKeyMapEnumList(saveKeys.value);
})

// 是否显示重复的提示
let showRepeatText = ref(false);
const configStore = useConfigStore();

function confirm() {
  if (!saveKeyName.value) return;
  // 查找重复的键
  let RepeatKeyName = KeyMapUtil.selectShortcutKeyByKeyMapList(saveKeys.value);

  // 是否和当前的快捷键名称重复
  if (RepeatKeyName === saveKeyName.value) {
    hide();
    return;
  }

  // 重复且无提示, 则进行一次提示
  if (RepeatKeyName && !showRepeatText.value) {
    showRepeatText.value = true;
    return;
  }

  // 不重复，或者 提示过了, 则保存
  configStore.setShortcut(saveKeyName.value, saveKeys.value);
  hide();
}

</script>

<template>
  <CDialog v-model:visible="showDialog" title="New Key" @ok="confirm">
    <div class="flex flex-col w-full">
      <div class="flex justify-center w-full h-14">
        <div v-if="saveKeys.length===0" class="mt-2.5 text-gray-400"> Press any key to set shortcut</div>
        <div class="p-2 m-2 px-4 opacity-80 bg-gray-200 bg-opacity-10 font-bold" v-for="key in saveKeys">
          {{ key.toUpperCase() }}
        </div>
      </div>
      <div v-show="showRepeatText" class="font-bold text-center mt-4">
        Keyboard shortcuts repeat: <span class="text-yellow-600">{{ saveKeyName }}</span>.
        <div class="mt-2">Do you need to replace it ?</div>
      </div>
    </div>
  </CDialog>
</template>

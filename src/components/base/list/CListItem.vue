<script setup lang="ts">
import {computed, getCurrentInstance, ref, watch} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import TheKeyMapCode from "@/components/base/list/TheKeyMapCode.vue";

type Props = {
  switchValue?: boolean,
  switchEnabled?: boolean,
  content: string,
  rightContent?: string[],
  tooltip?: string,
  placement?: string,
  leftIcon?: string,
  rightIcon?: string,
  bottomBorder?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  switchValue: false,
  switchEnabled: false,
  content: "",
  rightContent: () => [],
  tooltip: "",
  placement: "top",
  leftIcon: "icon-lock",
  rightIcon: "icon-right",
  bottomBorder: true,
});

const instance = getCurrentInstance();
const switchValue = ref(false);
watch(() => props.switchValue, (value) => {
  switchValue.value = value;
})
watch(switchValue, (value) => {
  if (!instance) return;
  instance.emit("update:switchValue", value);
})

const configStore = useConfigStore();
const isDarkMode = computed(() => configStore.isDarkMode);
</script>

<template>
  <div
      class="leading-12 px-3 cursor-pointer bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700 active:dark:bg-neutral-600">
    <div
        class="flex flex-row items-center"
        :class="bottomBorder?'border-b border-neutral-200 dark:border-neutral-600':''">
      <div class="flex-1 flex flex-row">
        <i class="iconfont text-xl leading-12" :class="leftIcon"/>
        <span class="ml-2 text-base leading-12">{{ content }}</span>
        <el-tooltip
            v-if="tooltip && tooltip.length !== 0"
            :content="tooltip"
            :effect="isDarkMode?'dark':'light'"
            :placement="placement"
            :hide-after="0">
          <i
              v-if="tooltip && tooltip.length !== 0"
              class="iconfont icon-question-circle text-xl leading-12 ml-2"
              @click.stop=""/>
        </el-tooltip>
      </div>
      <div v-if="rightContent.length>0" class="flex flex-row items-center">
        <TheKeyMapCode v-for="(keyCode,index) in rightContent" :key="index" :key-map-code="keyCode" :size="75" />
      </div>
      <el-switch v-if="switchEnabled" v-model="switchValue"/>
      <i v-else class="iconfont" :class="rightIcon"/>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>

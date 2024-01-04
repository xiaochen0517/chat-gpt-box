<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {Avatar, Factory, IAvatarProps} from "vue3-avataaars";

type Props = {
  switchValue?: boolean,
  switchEnabled?: boolean,
  content: string,
  tooltip?: string,
  placement?: string,
  leftIcon?: string,
  rightIcon?: string,
  bottomBorder?: boolean,
  leftAvatar?: Partial<IAvatarProps>,
}
const props = withDefaults(defineProps<Props>(), {
  switchValue: false,
  switchEnabled: false,
  content: "",
  tooltip: "",
  placement: "top",
  rightIcon: "icon-right",
  bottomBorder: true,
});

const avatarProps = ref<IAvatarProps>(Factory());

const instance = getCurrentInstance();
const switchValue = ref(false);
onMounted(() => {
  switchValue.value = props.switchValue;
  if (!props.leftIcon) {
    avatarProps.value = Factory(props.leftAvatar);
  }
});
watch(() => props.switchValue, (value) => {
  switchValue.value = value;
});
watch(() => props.leftAvatar, (value) => {
  avatarProps.value = Factory(value);
});
watch(switchValue, (value) => {
  if (!instance) return;
  instance.emit("update:switchValue", value);
});

const configStore = useConfigStore();
const isDarkMode = computed(() => configStore.isDarkMode);
</script>

<template>
  <div class="leading-12 px-3 cursor-pointer bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700 active:dark:bg-neutral-600">
    <div
        class="flex flex-row items-center"
        :class="bottomBorder?'border-b border-neutral-200 dark:border-neutral-600':''"
    >
      <div class="flex-1 flex flex-row items-center" :class="{'py-4': !leftIcon}">
        <Avatar
            v-if="!leftIcon"
            class="w-12 h-12 mr-3 rounded-full overflow-hidden bg-gray-600"
            v-bind="avatarProps"
            @click.stop="$emit('avatarClick')"
        />
        <i class="iconfont text-xl leading-12" :class="leftIcon"/>
        <span class="ml-2 text-base leading-12">{{ content }}</span>
        <el-tooltip
            v-if="tooltip && tooltip.length !== 0"
            :content="tooltip"
            :effect="isDarkMode?'dark':'light'"
            :placement="placement"
            :hide-after="0"
        >
          <i
              v-if="tooltip && tooltip.length !== 0"
              class="iconfont icon-question-circle text-xl leading-12 ml-2"
              @click.stop=""
          />
        </el-tooltip>
      </div>
      <slot name="right"/>
      <el-switch v-if="switchEnabled" v-model="switchValue"/>
      <i v-else class="iconfont" :class="rightIcon"/>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>

<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {Avatar, IAvatarProps} from "vue3-avataaars";
import {AvatarUtil} from "@/utils/AvatarUtil.ts";

type Props = {
  switchValue?: boolean,
  switchEnabled?: boolean,
  content: string,
  tooltip?: string,
  placement?: string,
  leftIcon?: string,
  showLeftIcon?: boolean,
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
  showLeftIcon: true,
  rightIcon: "icon-right",
  bottomBorder: true,
});

const avatarProps = ref<IAvatarProps>(AvatarUtil.getDefaultAvatar());

const instance = getCurrentInstance();
const switchValue = ref(false);
onMounted(() => {
  switchValue.value = props.switchValue;
  if (!props.leftIcon) {
    avatarProps.value = AvatarUtil.initDefaultAvatar(props.leftAvatar);
  }
});
watch(() => props.switchValue, (value) => {
  switchValue.value = value;
});
watch(() => props.leftAvatar, (value) => {
  avatarProps.value = AvatarUtil.initDefaultAvatar(value);
});
watch(switchValue, (value) => {
  if (!instance) return;
  instance.emit("update:switchValue", value);
});

const configStore = useConfigStore();
const isDarkMode = computed(() => configStore.isDarkMode);
</script>

<template>
  <div class="rounded-xl px-3 cursor-pointer bg-neutral-100 hover:bg-neutral-400 active:bg-neutral-300 dark:bg-neutral-900 hover:dark:bg-neutral-800 hover:bg-opacity-20 active:dark:bg-neutral-600">
    <div class="flex flex-row items-center">
      <div class="flex-1 flex flex-row items-center" :class="{'py-2': !leftIcon && showLeftIcon}">
        <Avatar
            v-if="!leftIcon && showLeftIcon"
            class="w-12 h-12 mr-3 rounded-full overflow-hidden bg-gray-600"
            v-bind="avatarProps"
            @click.stop="$emit('avatarClick')"
        />
        <i v-if="showLeftIcon" class="iconfont text-xl" :class="leftIcon"/>
        <span class="ml-2 text-base leading-10">{{ content }}</span>
        <el-tooltip
            v-if="tooltip && tooltip.length !== 0"
            :content="tooltip"
            :effect="isDarkMode?'dark':'light'"
            :placement="placement"
            :hide-after="0"
            :show-arrow="false"
        >
          <i
              v-if="tooltip && tooltip.length !== 0"
              class="iconfont icon-question-circle text-xl ml-2"
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

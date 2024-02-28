<script setup lang="ts">
import {ref} from "vue";
import SideBarContainer from "@/components/sidebar/SideBarContainer.vue";

const drawerVisible = ref(false);

const show = () => {
  drawerVisible.value = true;
};
const hide = () => {
  drawerVisible.value = false;
};
defineExpose({
  show,
  hide,
});
</script>

<template>
  <el-drawer
      v-model="drawerVisible"
      :show-close="false"
      :with-header="false"
      :append-to-body="true"
      direction="ltr"
      size="20rem"
  >
    <SideBarContainer @changeChatClick="$emit('changeChatClick', $event)"/>
  </el-drawer>
</template>

<script setup>
import {ref} from "vue";

const drawerVisible = ref(false);

const show = () => {
  drawerVisible.value = true;
};
defineExpose({
  show
});
</script>

<template>

  <el-drawer
      v-model="drawerVisible"
      title="I am the title"
      direction="ltr"
      size="70%">
    123
  </el-drawer>
</template>

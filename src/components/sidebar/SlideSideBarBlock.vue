<script setup>
import {ref} from "vue";

const drawerVisible = ref(false);
</script>

<template>

  <el-drawer
      v-model="drawerVisible"
      title="I am the title"
      direction="ltr">
    123
  </el-drawer>
</template>

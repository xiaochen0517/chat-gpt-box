<script setup>
</script>

<template>
  <div class="bg-white dark:bg-gray-900 dark:text-white flex-row w-full h-full">
    <router-view/>
  </div>
</template>

<style lang="less">
@import "assets/fonts/harmonyos_fonts.css";

body,
html {
@apply p-0 m-0 h-screen w-full;
  font-family: "HarmonyOS Sans", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

#app {
@apply h-full w-full text-sm;
}


div::-webkit-scrollbar {
@apply w-2 h-2 rounded-full;
}

div::-webkit-scrollbar-track {
@apply bg-gray-800;
}

div::-webkit-scrollbar-thumb {
@apply bg-gray-600 rounded-full;
}

div::-webkit-scrollbar-thumb:hover {
@apply bg-gray-700;
}
</style>

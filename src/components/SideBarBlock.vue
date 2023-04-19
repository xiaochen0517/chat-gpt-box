<script setup>
import {ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

const sideBarTitle = ref("title");

const key = ref("");
const saveApiKey = () => {
  console.log("key", key.value);
  if (key.value.length <= 0) {
    return;
  }
  store.commit("setApiKey", key.value);
};
</script>

<template>
  <div class="side-bar-block">
    <div class="title">{{ sideBarTitle }}</div>
    <div>
      <a-input v-model:value="key" placeholder="key"/>
      <a-button type="primary" @click="saveApiKey">save</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.side-bar-block {
  width: 20%;
  height: 100vh;
  background: gray;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>

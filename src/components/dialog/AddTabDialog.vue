<script setup>
import {ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

const props = defineProps({
  robotIndex: {
    type: Number,
    default: 0
  },
});

const dialogVisible = ref(false);
const tabName = ref("");
const title = ref("Add Tab");
const commit = () => {
  console.log("commit", tabName.value);
  if (tabName.value === "") {
    return;
  }
  store.commit("addChatTab", {
    robotIndex: props.robotIndex,
    tabName: tabName.value
  });
  tabName.value = "";
  dialogVisible.value = false;
};

const show = () => {
  console.log("show");
  dialogVisible.value = true;
};
defineExpose({
  show
});
</script>

<template>
  <div class="add-tab-dialog">
    <a-modal v-model:visible="dialogVisible" :title="title" @ok="commit" @cancel="dialogVisible = false">
      <a-form>
        <a-form-item label="Tab Name">
          <a-input v-model:value="tabName"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>

</style>

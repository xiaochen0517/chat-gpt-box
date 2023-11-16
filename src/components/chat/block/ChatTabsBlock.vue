<script setup lang="ts">
import {computed, getCurrentInstance, nextTick, ref, watch} from "vue";
import ChatMsgListBlock from "./ChatMsgListBlock.vue";
import {useStore} from "vuex";
import AddTabDialog from "../dialog/AddTabDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import CTabs from "@/components/base/CTabs.vue";
import CTabPane from "@/components/base/CTabPane.vue";
import {ElMessageBox} from "element-plus";
import SlideSideBarBlock from "@/components/sidebar/SlideSideBarBlock.vue";
import {Robot, RobotTabChatInfo} from "@/types/State.ts";

/**
 * 注册操作tab的快捷键
 */
const store = useStore();
const shortcut = computed(() => store.state.config.shortcut);
const keys = useMagicKeys();
const addTabKey = keys[shortcut.value.addTab];
const addTabDialogRefs = ref<InstanceType<typeof AddTabDialog> | null>(null);
whenever(addTabKey, () => {
  if (!addTabDialogRefs.value) return;
  addTabDialogRefs.value.show();
});
const removeTabKey = keys[shortcut.value.removeTab];
whenever(removeTabKey, () => {
  confirmRemoveTab(activeTabIndex.value);
});
const prevTabKey = keys[shortcut.value.prevTab];
whenever(prevTabKey, () => {
  const targetIndex = activeTabIndex.value - 1;
  if (targetIndex >= 0) {
    activeTabIndex.value = targetIndex;
  }
});
const nextTabKey = keys[shortcut.value.nextTab];
whenever(nextTabKey, () => {
  const targetIndex = activeTabIndex.value + 1;
  if (targetIndex < chatTabNameList.value.length) {
    activeTabIndex.value = targetIndex;
  }
});
const cleanTabChatKey = keys[shortcut.value.cleanTabChat];
whenever(cleanTabChatKey, () => {
  cleanTabChat();
});

const props = defineProps({
  robotIndex: {
    type: Number,
    default: 0
  },
  tabIndex: {
    type: Number,
    default: 0
  }
});

const cleanTabChat = () => {
  store.commit("cleanTabChat", {
    robotIndex: props.robotIndex,
    tabIndex: activeTabIndex.value,
  });
};

const activeTabIndex = ref<number>(0);
watch(
    () => activeTabIndex.value,
    () => {
      scrollToBottom();
      // 更新props.tabIndex
      if (!instance) return;
      instance.emit('update:tabIndex', activeTabIndex.value)
    }
);
const confirmRemoveTab = (targetKey: number) => {
  removeTab(targetKey);
};

const addTab = () => {
  if (!addTabDialogRefs.value) return;
  addTabDialogRefs.value.show();
}

const removeTab = (targetKey: number) => {
  if (activeTabIndex.value === targetKey) {
    // 切换tab
    if (targetKey === chatTabNameList.value.length - 1) {
      activeTabIndex.value = targetKey - 1;
    } else {
      activeTabIndex.value = targetKey;
    }
  }
  store.commit("removeChatTab", {
    robotIndex: props.robotIndex,
    tabIndex: targetKey
  });
  // 检查当前tab是否是最后一个tab
  if (chatTabNameList.value.length === 0) {
    store.commit("addChatTab", {
      robotIndex: props.robotIndex,
      tabName: "default",
    });
    activeTabIndex.value = 0;
  }
};

const chatTabNameList = computed(() => {
  return store.state.chatHistory[props.robotIndex]
      .map((item: RobotTabChatInfo) => item.name);
});
const robotOptions = computed(() => store.state.robotList[props.robotIndex].options);
const removeTabClick = (index: number) => {
  ElMessageBox.confirm("Are you sure to remove this tab?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning"
  }).then(() => {
    removeTab(index);
  }).catch(() => {
  });
};

const slideSideBarBlockRefs = ref<InstanceType<typeof SlideSideBarBlock> | null>(null);
const showSlideSideBar = () => {
  if (!slideSideBarBlockRefs.value) return;
  slideSideBarBlockRefs.value.show();
};

const instance = getCurrentInstance();
const changeRobotClick = (index: number, item: Robot) => {
  if (!instance) return;
  instance.emit('changeRobotClick', index, item);
};

const getTabIndex = () => {
  return activeTabIndex.value;
};
const scrollContainerRefs = ref();
const scrollToBottom = () => {
  // 滚动到底部
  nextTick(() => {
    scrollContainerRefs.value.scrollTop = scrollContainerRefs.value.scrollHeight;
  });
};
defineExpose({
  getTabIndex,
  scrollToBottom,
});
</script>

<template>
  <div
      ref="scrollContainerRefs"
      class="overflow-hidden overflow-y-auto box-border scroll-container mt-28">
    <CTabs
        v-model:activeKey="activeTabIndex"
        :tabNames="chatTabNameList"
        :robotOptions="robotOptions"
        @addTabClick="addTab"
        @removeTabClick="removeTabClick"
        @showSlideSideBarClick="showSlideSideBar">
      <CTabPane
          v-for="(_number, index) in chatTabNameList.length"
          :key="index">
        <ChatMsgListBlock
            :robotIndex="props.robotIndex"
            :tabIndex="index"/>
      </CTabPane>
    </CTabs>
    <AddTabDialog ref="addTabDialogRefs" :robotIndex="props.robotIndex"/>
    <SlideSideBarBlock ref="slideSideBarBlockRefs" @onClick="changeRobotClick"/>
  </div>
</template>

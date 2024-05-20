<script setup lang="ts">

import ChatMessageControlButton from "@/components/base/button/ChatMessageControlButton.vue";

type Props = {
  role: string,
  copySuccess: boolean,
  showRefresh: boolean,
  generating: boolean,
}

withDefaults(defineProps<Props>(), {
  role: "user",
  copySuccess: false,
  showRefresh: false,
  generating: false,
});

defineEmits([
  "copy",
  "edit",
  "delete",
  "regenerating",
]);
</script>

<template>
  <div class="flex flex-row gap-1 mt-4 text-base font-medium">
    <ChatMessageControlButton :icon="copySuccess?'icon-check':'icon-file-copy'" tooltip="Copy" @click="$emit('copy')"/>
    <ChatMessageControlButton v-if="role !== 'system'" icon="icon-edit" tooltip="Edit" @click="$emit('edit')"/>
    <el-popconfirm
        title="delete message"
        @confirm="$emit('delete')"
        confirm-button-type="danger"
        confirm-button-text="Delete"
    >
      <template #reference>
        <div>
          <ChatMessageControlButton v-if="role !== 'system'" icon="icon-delete" tooltip="Delete"/>
        </div>
      </template>
    </el-popconfirm>
    <ChatMessageControlButton v-if="showRefresh && !generating" icon="icon-reload" tooltip="Regenerate" @click="$emit('regenerating')"/>
  </div>
</template>

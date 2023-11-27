<script>
import draggable from "vuedraggable";

export default {
  name: "TestPage",
  components: {
    draggable
  },
  data() {
    return {
      otherChatList: [
        {
          id: 1,
          name: "Robot 1"
        },
        {
          id: 2,
          name: "Robot 2"
        },
        {
          id: 3,
          name: "Robot 3"
        },
        {
          id: 4,
          name: "Robot 4"
        },
        {
          id: 5,
          name: "Robot 5"
        }
      ]
    }
  }
}
</script>

<template>
  <draggable v-model="otherChatList" item-key="id">
    <template #item="{element}">
      <div>{{ element.name }}</div>
    </template>
  </draggable>
</template>
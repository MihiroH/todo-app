<template lang="pug">
TodoItemInput(
  :task="task"
  @input="updateValue"
  @input-end="saveEdit"
  @shortcut_key-meta-enter="saveEdit"
)
</template>

<script>
import TodoItemInput from '@/components/TodoItemInput'

export default {
  name: 'TodoItemInsertMode',
  components: {
    TodoItemInput
  },
  props: {
    uid: {
      type: String,
      required: true
    },
    task: {
      type: String,
      required: true
    }
  },
  methods: {
    updateValue(newValue) {
      this.$emit('input', newValue)
    },
    saveEdit() {
      this.$emit('input-end', this.task)
    }
  }
}
</script>

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

import { mapMutations } from 'vuex'

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
  data() {
    return {
      value: ''
    }
  },
  methods: {
    ...mapMutations('todos', [
      'EDIT_TODO'
    ]),
    updateValue(newValue) {
      this.value = newValue
      this.$emit('input', newValue)
    },
    saveEdit() {
      if (this.value) {
        this.EDIT_TODO({
          id: this.uid,
          params: {
            todo: this.value
          }
        })
      } else {
        this.value = this.task
      }

      this.$emit('input-end')
    }
  }
}
</script>

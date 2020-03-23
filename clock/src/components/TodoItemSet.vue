<template lang="pug">
TodoItemInput(
  :task="task"
  @input="updateValue"
  @input-end="setTodo"
  @shortcut_key-meta-enter="setTodo"
)
</template>

<script>
import TodoItemInput from '@/components/TodoItemInput'

import { mapMutations } from 'vuex'

export default {
  name: 'TodoItemSet',
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
    },
    status: {
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
      'EDIT_TODO',
      'REMOVE_TODO'
    ]),
    updateValue(newValue) {
      this.value = newValue
      this.$emit('input', newValue)
    },
    setTodo() {
      if (!this.value) {
        this.REMOVE_TODO({
          status: this.status,
          id: this.uid
        })
        return
      }

      this.EDIT_TODO({
        id: this.uid,
        params: {
          todo: this.value
        }
      })

      this.$emit('input-end')
    }
  }
}
</script>


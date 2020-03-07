<template lang="pug">
TodoItemInput(
  :uid="uid"
  :task="task"
  @input="updateValue"
  @input-end="saveEdit"
)
</template>

<script>
import TodoItemInput from '@/components/TodoItemInput'

import { mapMutations } from 'vuex'

export default {
  name: 'TodoItemInputSave',
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
    },
    saveEdit() {
      if (this.value) {
        this.EDIT_TODO({
          id: this.uid,
          todo: this.value
        })
      } else {
        this.value = this.task
      }

      this.$emit('input-end')
    }
  }
}
</script>

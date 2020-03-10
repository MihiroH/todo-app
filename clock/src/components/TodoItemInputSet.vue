<template lang="pug">
TodoItemInput(
  :uid="uid"
  :task="task"
  @input="updateValue"
  @input-end="setTodo"
)
</template>

<script>
import TodoItemInput from '@/components/TodoItemInput'

import { mapMutations } from 'vuex'

export default {
  name: 'TodoItemInputSet',
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
      'EDIT_TODO',
      'REMOVE_TODO'
    ]),
    updateValue(newValue) {
      this.value = newValue
    },
    setTodo() {
      if (!this.value) return this.REMOVE_TODO(this.uid)

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

<style lang="stylus" module>
.todoInput
  border none
  background transparent
  padding 4px
  padding-left 0
  outline none
  font inherit
  color inherit
  display block
  width 100%
</style>



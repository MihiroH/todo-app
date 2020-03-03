<template lang="pug">
li(
  :class="$style.wrap"
  @keyup.exact.enter="edit"
  @keyup.delete="removeTodo"
  @keyup.ctrl.190="toggleChecked"
)
  TodoItemInput(
    v-if="editMode"
    :task="task"
    :uid="uid"
    @input-change="$emit('input-change')"
    @input-end="endEdit"
  )
  TodoItemText(
    v-else
    :task="task"
    :isChecked="isChecked"
    :class="$style.txt"
    @edit-icon-click="edit"
    @trash_can-icon-click="removeTodo"
    @checkbox-click="toggleChecked"
  )
</template>

<script>
import TodoItemInput from '@/components/TodoItemInput'
import TodoItemText from '@/components/TodoItemText'

import { mapMutations } from 'vuex'

export default {
  name: 'TodoItem',
  components: {
    TodoItemInput,
    TodoItemText
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
      editModeFlg: false,
      isChecked: false,
      timerId: null
    }
  },
  computed: {
    editMode() {
      if (this.editModeFlg) return true
      if (this.task) return false
      return true
    }
  },
  methods: {
    ...mapMutations('todos', [
      'REMOVE_TODO'
    ]),
    edit() {
      this.editModeFlg = true
    },
    endEdit() {
      this.editModeFlg = false
    },
    removeTodo() {
      if (this.editModeFlg) return
      this.REMOVE_TODO(this.uid)
    },
    completeTodo() {
      this.REMOVE_TODO(this.uid)
    },
    toggleChecked() {
      this.isChecked = !this.isChecked
      this.wait(1500, this.completeTodo)
    },
    wait(delay, callback) {
      if (this.timerId) {
        clearTimeout(this.timerId)
        this.timerId = null
        return
      }

      this.timerId = setTimeout(() => {
        callback()
      }, delay)
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  padding 0 8px
  color #fff
</style>

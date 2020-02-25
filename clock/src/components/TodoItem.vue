<template lang="pug">
li(:class="$style.wrap")
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
    @edit-icon-click="edit"
    @trash_can-icon-click="removeTodo"
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
      editModeFlg: false
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
      this.$emit('edit-icon-click')
    },
    endEdit() {
      this.editModeFlg = false
      this.$emit('input-end')
    },
    removeTodo() {
      this.REMOVE_TODO(this.uid)
    },
    handleKeypress() {
      const self = this

      const keyStatus = {}

      // キーが押されたら実行する処理
      const shortcutKey = (e) => {
        keyStatus[e.keyCode] = true; // 該当のキーコードをtrueにする
        // option(alt) + n を押下時
        if(keyStatus[18] && keyStatus[78]) {
          self.addTodo('')
          return false
        }

        // option(alt) + enter を押下時
        // if(keyStatus[91] && keyStatus[13]) {
        //   self.addTodo('enter')
        //   return false
        // }
      }

      // キーが離されたら実行する処理
      const removeKeyStatus = (e) => keyStatus[e.keyCode] = false

      document.addEventListener('keydown', shortcutKey)
      document.addEventListener('keyup', removeKeyStatus)

      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('keydown', shortcutKey);
        document.removeEventListener('keyup', removeKeyStatus);
      });
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  padding-left 8px
  color #fff
</style>

<template lang="pug">
li(
  :class="$style.wrap"
  @keyup.exact.enter="edit"
  @keyup.delete="removeTodo"
  @keydown="handleKeydown"
)
  div(:class="$style.timerbox")
    div(:class="$style.timerboxTimer") {{ todoTimer  }}
    div(
      :class="[$style.timerboxBtn, { [$style['is-active']]: startTimerFlg }]"
      @click="toggleTimer"
    )
  TodoItemInputSet(
    v-if="!task"
    :uid="uid"
    :task="task"
    @input-end="endEdit"
  )
  TodoItemInputSave(
    v-else-if="editMode"
    :uid="uid"
    :task="task"
    @input-end="endEdit"
  )
  TodoItemText(
    v-else
    :task="task"
    :isChecked="isChecked"
    :class="$style.txt"
    @item-doubleclick="edit"
    @edit-icon-click="edit"
    @trash_can-icon-click="removeTodo"
    @checkbox-click="toggleChecked"
  )
</template>

<script>
import TodoItemInputSave from '@/components/TodoItemInputSave'
import TodoItemInputSet from '@/components/TodoItemInputSet'
import TodoItemText from '@/components/TodoItemText'

import { mapMutations } from 'vuex'

export default {
  name: 'TodoItem',
  components: {
    TodoItemInputSave,
    TodoItemInputSet,
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
      waitTimerId: null,
      todoTimerId: null,
      startTimerFlg: false,
      todoTimerSeconds: 0,
      todoTimerMinutes: 0,
      todoTimerHours: 0
    }
  },
  computed: {
    todoTimer() {
      return `${this.todoTimerHours}:${this.todoTimerMinutes}:${this.todoTimerSeconds}`
    },
    editMode() {
      if (this.editModeFlg) return true
      if (this.task) return false
      return true
    }
  },
  created() {
  },
  methods: {
    ...mapMutations('todos', [
      'EDIT_TODO',
      'REMOVE_TODO'
    ]),
    edit() {
      this.editModeFlg = true
    },
    endEdit() {
      this.editModeFlg = false
      this.$el.focus()
    },
    removeTodo() {
      if (this.editMode) return
      this.REMOVE_TODO(this.uid)
      this.$emit('todo-removed')
    },
    completeTodo() {
      this.EDIT_TODO({
        id: this.uid,
        todo: this.task,
        status: 'completed'
      })
      this.$emit('todo-removed')
    },
    toggleChecked() {
      this.isChecked = !this.isChecked
      this.wait(1500, this.completeTodo)
    },
    startTimer() {
      const self = this
      this.todoTimerId = setInterval(() => {
        if (self.todoTimerSeconds === 59) {
          self.todoTimerSeconds = 0
          self.todoTimerMinutes++
        } else {
          self.todoTimerSeconds++
        }

        if (self.todoTimerMinutes === 59) {
          self.todoTimerMinutes = 0
          self.todoTimerHours++
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.todoTimerId)
    },
    toggleTimer() {
      if (this.startTimerFlg) {
        this.startTimerFlg = false
        return this.stopTimer()
      }
      this.startTimerFlg = true
      return this.startTimer()
    },
    wait(delay, callback) {
      if (this.waitTimerId) {
        clearTimeout(this.waitTimerId)
        this.waitTimerId = null
        return
      }

      this.waitTimerId = setTimeout(() => {
        callback()
      }, delay)
    },
    handleKeydown(e) {
      // Windows Ctrl キー or Mac Command キー + . の判定
      // https://hacknote.jp/archives/7321/
      if (e.ctrlKey && e.metaKey) return
      if (!e.ctrlKey && !e.metaKey) return
      if (e.keyCode === 190) return this.toggleChecked()
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  padding 0 8px
  color #fff
  position relative
.timerbox
  position absolute
  top 50%
  transform translateY(-50%)
  right calc(100% + 34px)
  display flex
  align-items center
  font-size 14px
.timerboxBtn
  color #111
  background #9acd32
  margin-left 10px
  padding 8px
  lihe-height 21px
  border-radius 8px
  &:hover
    cursor pointer
  &.is-active
    background #DF5656
</style>

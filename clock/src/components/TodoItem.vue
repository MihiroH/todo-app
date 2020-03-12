<template lang="pug">
li(
  :class="$style.wrap"
  @keyup.exact.enter="edit"
  @keyup.delete="removeTodo"
  @keydown="handleKeydown"
)
  div(:class="classNameTimerbox")
    div {{ todoTimer  }}
    div(
      v-if="todoObj.status === 'todo'"
      :class="classNameTimerboxBtn"
      @click="toggleTimer"
    )
  TodoItemInputSet(
    v-if="!todoObj.todo"
    :uid="todoObj.id"
    :task="todoObj.todo"
    :status="'todo'"
    @input-end="endEdit"
  )
  TodoItemInputSave(
    v-else-if="editMode"
    :uid="todoObj.id"
    :task="todoObj.todo"
    @input-end="endEdit"
  )
  TodoItemText(
    v-else
    :task="todoObj.todo"
    :status="todoObj.status"
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
    todoObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editModeFlg: false,
      isChecked: false,
      waitTimerId: null,
      todoTimerId: null,
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
      if (this.todoObj.todo) return false
      return true
    },
    classNameTimerbox() {
      return [
        this.$style.timerbox,
        {
          [this.$style['is-active']]: this.todoObj.status === 'done'
        }
      ]
    },
    classNameTimerboxBtn() {
      return [
        this.$style.timerboxBtn,
        {
          [this.$style['is-active']]: this.todoObj.startTimerFlg
        }
      ]
    }
  },
  watch: {
    classNameTimerboxBtn: {
      handler: function () {
        if (this.todoObj.startTimerFlg) return this.startTimer()
        this.stopTimer()
      },
      immediate: true
    }
  },
  created() {
    const workingTimer = this.todoObj.workingTimer
    this.todoTimerSeconds = workingTimer.seconds
    this.todoTimerMinutes = workingTimer.minutes
    this.todoTimerHours = workingTimer.hours
  },
  methods: {
    ...mapMutations('todos', [
      'ADD_TODO',
      'EDIT_TODO',
      'REMOVE_TODO',
      'TOGGLE_TODO_LIST_TIMER'
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
      this.REMOVE_TODO({
        status: this.todoObj.status,
        id: this.todoObj.id
      })
      this.$emit('todo-removed')
    },
    completeTodo() {
      const todo = this.todoObj
      this.REMOVE_TODO({
        status: 'todo',
        id: todo.id
      })
      this.ADD_TODO({
        id: todo.id,
        todo: todo.todo,
        status: 'done',
        startTimerFlg: false,
        workingTimer: {
          seconds: this.todoTimerSeconds,
          minutes: this.todoTimerMinutes,
          hours: this.todoTimerHours
        }
      })
    },
    saveTodo() {
      if (!this.todoObj.startTimerFlg) return

      this.EDIT_TODO({
        id: this.todoObj.id,
        params: {
          workingTimer: {
            seconds: this.todoTimerSeconds,
            minutes: this.todoTimerMinutes,
            hours: this.todoTimerHours
          }
        }
      })
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
      this.TOGGLE_TODO_LIST_TIMER(this.todoObj.id)
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
  &.is-active
    right calc(100% + 8px)
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

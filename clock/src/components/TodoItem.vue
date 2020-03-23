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
  TodoItemSet(
    v-if="!todoObj.todo"
    :uid="todoObj.id"
    :task="todoText"
    :status="'todo'"
    :class="$style.input"
    @input="checkValue"
    @input-end="endEdit"
  )
  TodoItemInsertMode(
    v-else-if="editMode"
    :uid="todoObj.id"
    :task="todoText"
    :class="$style.input"
    @input="checkValue"
    @input-end="endEdit"
  )
  TodoItemVisualMode(
    v-else
    :task="todoText"
    :status="todoObj.status"
    :isChecked="isChecked"
    :class="$style.txt"
    @item-doubleclick="edit"
    @edit-icon-click="edit"
    @trash_can-icon-click="removeTodo"
    @checkbox-click="toggleChecked"
  )
  SuggestionResultList(
    v-if="isVisible"
    :class="$style.suggestList"
    :resultList="suggestionDateList"
    @suggestion-selected="updateText"
  )
</template>

<script>
import SuggestionResultList from '@/components/SuggestionResultList'
import TodoItemInsertMode from '@/components/TodoItemInsertMode'
import TodoItemSet from '@/components/TodoItemSet'
import TodoItemVisualMode from '@/components/TodoItemVisualMode'

import { mapGetters, mapMutations } from 'vuex'
import { suggestDateFromTo } from '@/utils/suggestDateFromTo'

export default {
  name: 'TodoItem',
  components: {
    SuggestionResultList,
    TodoItemInsertMode,
    TodoItemSet,
    TodoItemVisualMode
  },
  props: {
    todoObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      text: '',
      editModeFlg: false,
      isChecked: false,
      isVisible: false,
      waitTimerId: null,
      todoTimerId: null,
      todoTimerSeconds: 0,
      todoTimerMinutes: 0,
      todoTimerHours: 0,
      fromDateList: [],
      toDateList: []
    }
  },
  computed: {
    ...mapGetters('todos', [
      'getSelectedStatus'
    ]),
    todoText() {
      if (this.text) return this.text
      return this.todoObj.todo
    },
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
    },
    startTimerFlg() {
      return this.todoObj.startTimerFlg
    },
    suggestionDateList() {
      return [
        ...this.fromDateList,
        ...this.toDateList
      ]
    }
  },
  watch: {
    startTimerFlg: {
      handler: function (value) {
        if (value) return this.startTimer()
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
    updateText(selected) {
      const el = this.$el.querySelector(`.${this.$style.input}`)
      const value = this.text
      const regex = new RegExp(`${selected.label} ([0-9]| |/)*`)
      const beforeWords = value.split(regex)[0]
      const currentWords = value.match(regex)[0]
      const selectionRange = beforeWords.length + currentWords.length

      el.setSelectionRange(selectionRange, selectionRange)

      const cursorStartPosition = el.selectionStart
      const afterWords = value.substr(cursorStartPosition, value.length)

      const words = `${beforeWords}${selected.label} ${selected.textContent} ${afterWords}`

      this.closeSuggestionList()
      this.text = words
    },
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
    doneTodo() {
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
      this.wait(1500, this.doneTodo)
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
    openSuggestionList() {
      if (this.isVisible) return

      this.isVisible = true
    },
    closeSuggestionList() {
      this.isVisible = false
    },
    checkValue(value) {
      this.text = value
      if (/from |to /g.test(value)) {
        this.openSuggestionList()
        this.startGuess(value)
        return
      }
      this.closeSuggestionList()
    },
    startGuess(value) {
      if (/from /g.test(value)) {
        this.fromDateList = suggestDateFromTo('from', value.split('from ')[1])
      }
      if (/to /g.test(value)) {
        this.toDateList = suggestDateFromTo('to', value.split('to ')[1])
      }
    },
    handleKeydown(e) {
      // Windows Ctrl キー or Mac Command キー + . の判定
      // https://hacknote.jp/archives/7321/
      if (this.getSelectedStatus !== 'todo') return
      if (e.ctrlKey && e.metaKey) return
      if (!e.ctrlKey && !e.metaKey) return
      // .
      if (e.keyCode === 190) return this.toggleChecked()
      // t
      if (e.keyCode === 84) return this.toggleTimer()
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  padding 0 8px
  color #fff
  position relative
.input
  backgrond inherit
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
.suggestList
  border-bottom-left-radius 25px
  border-bottom-right-radius @border-bottom-left-radius
</style>

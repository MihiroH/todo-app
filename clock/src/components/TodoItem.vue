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
    v-if="mixinIsVisibleSuggestionList"
    :class="$style.suggestionList"
    :currentText="todoText"
    :resultList="mixinSuggestionDateList"
    @suggestion-selected="mixinHandleSelectSuggestion"
  )
</template>

<script>
import SuggestionResultList from '@/components/SuggestionResultList'
import TodoItemInsertMode from '@/components/TodoItemInsertMode'
import TodoItemSet from '@/components/TodoItemSet'
import TodoItemVisualMode from '@/components/TodoItemVisualMode'

import { mapGetters, mapMutations } from 'vuex'
import { mixinSuggestDateFromTo } from '@/mixins/suggestDateFromTo'

export default {
  name: 'TodoItem',
  components: {
    SuggestionResultList,
    TodoItemInsertMode,
    TodoItemSet,
    TodoItemVisualMode
  },
  mixins: [mixinSuggestDateFromTo],
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
      waitTimerId: null,
      todoTimerId: null,
      todoTimerSeconds: 0,
      todoTimerMinutes: 0,
      todoTimerHours: 0
    }
  },
  computed: {
    ...mapGetters('todos', [
      'getSelectedStatus'
    ]),
    todoText() {
      return this.text || this.todoObj.todo
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
    edit() {
      this.editModeFlg = true
    },
    endEdit(text) {
      this.mixinCloseSuggestionList()
      this.saveTodo(text)

      this.text = text
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
    saveTodo(text) {
      const selectedDateFromTo = this.mixinSelectedDateFromTo(text)
      const fromDate = selectedDateFromTo.fromDate
      const toDate = selectedDateFromTo.toDate
      const date = Object.assign({}, this.todoObj.date)

      if (Object.keys(fromDate).length) date.fromDate = fromDate
      if (Object.keys(toDate).length) date.toDate = toDate

      this.EDIT_TODO({
        id: this.todoObj.id,
        params: {
          todo: text,
          workingTimer: {
            seconds: this.todoTimerSeconds,
            minutes: this.todoTimerMinutes,
            hours: this.todoTimerHours
          },
          date: date
        }
      })
    },
    saveTodoTimer() {
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
          this.saveTodoTimer()
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
    checkValue(value) {
      this.text = value
      this.mixinCheckValue(value)
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
.suggestionList
  border-top 2px solid #9acd32
  border-bottom-left-radius 25px
  border-bottom-right-radius @border-bottom-left-radius
</style>

<template lang="pug">
li(
  :class="$style.wrap"
  @keyup.delete.self="removeTodo"
  @keydown.self="handleKeydown"
)
  BaseCheckbox(
    v-if="todoObj.status === 'todo'"
    :isChecked="isChecked"
    :class="$style.checkbox"
    @checkbox-click="toggleChecked"
  )
  div(:class="$style.body")
    div(:class="$style.primary")
      InputReadingWriting(
        :value="todoObj.todo"
        :class="$style.taskName"
        @input-end="endEdit"
      )
    div(:class="$style.secondary")
      ul(:class="[$style.iconList, {[$style['is-active']]: isVisibleCalendar}]")
        li(
          v-for="(icon, index) in iconList"
          :key="index"
          :class="icon.className"
          @click="toggleVisibleCalendar"
        )
          Calendar(
            :themeColor="icon.themeColor"
            :imgSrc="require(`@/assets/${icon.img}`)"
            :imgAlt="icon.alt"
            :currentDate="todoObj.date[icon.typeOfDate]"
            @calendar-set="updateCalendarDate($event, icon.typeOfDate)"
            @calendar-hidden="toggleVisibleCalendar"
          )
      div(:class="classNameTimerbox")
        div(v-if="todoTimer.minutes === 0")
          | {{ todoTimer.seconds }}
          span s
        div(v-else)
          InputNumberAdvanced(
            :minValue="0"
            :maxValue="999"
            :initializeCount="todoTimer.minutes"
            :useZeroPadding="false"
            @input-countup="updateTimer"
            @input-countdown="updateTimer"
          )
          span m
        span &nbsp;/&nbsp;
        InputNumberAdvanced(
          :minValue="1"
          :maxValue="999"
          :initializeCount="1"
          :useZeroPadding="false"
        )
        span m
        div(
          v-if="todoObj.status === 'todo'"
          :class="classNameTimerboxBtn"
          @click="toggleTimer(todoObj.startTimerFlg)"
        )
</template>

<script>
import BaseCheckbox from '@/components/BaseCheckbox'
import Calendar from '@/components/Calendar'
import InputHoursMinutes from '@/components/InputHoursMinutes'
import InputNumberAdvanced from '@/components/InputNumberAdvanced'
import InputReadingWriting from '@/components/InputReadingWriting'

import { mapGetters, mapMutations } from 'vuex'
import { mixinSuggestDateFromTo } from '@/mixins/suggestDateFromTo'

export default {
  name: 'TodoItem',
  components: {
    BaseCheckbox,
    Calendar,
    InputHoursMinutes,
    InputNumberAdvanced,
    InputReadingWriting
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
      isChecked: false,
      waitTimerId: null,
      todoTimerId: null,
      todoTimer: {
        seconds: 0,
        minutes: 0
      },
      iconList: [
        {
          typeOfDate: 'fromDate',
          className: this.$style.startDate,
          themeColor: '#4eaad4',
          img: 'icon_calendar.svg',
          alt: '開始日'
        },
        {
          typeOfDate: 'toDate',
          className: this.$style.dueDate,
          themeColor: '#df5656',
          img: 'icon_flag.svg',
          alt: '期日'
        }
      ],
      isVisibleCalendar: false
    }
  },
  computed: {
    ...mapGetters('todos', [
      'getSelectedStatus'
    ]),
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
    this.todoTimer.minutes = workingTimer.minutes
  },
  methods: {
    ...mapMutations('todos', [
      'ADD_TODO',
      'EDIT_TODO',
      'REMOVE_TODO',
      'TOGGLE_TODO_LIST_TIMER'
    ]),
    updateTaskName(newValue) {
      this.taskName = newValue
    },
    endEdit(text) {
      this.saveTodo(text)
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
          minutes: this.todoTimer.minutes
        }
      })
    },
    saveTodo(text, dateObj) {
      const date = Object.assign({}, this.todoObj.date)

      if (Object.keys(dateObj).length) {
        Object.keys(dateObj).forEach(key => date[key] = dateObj[key])
      }

      this.EDIT_TODO({
        id: this.todoObj.id,
        params: {
          todo: text,
          workingTimer: {
            seconds: this.todoTimerSeconds,
            minutes: this.todoTimer.minutes
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
            minutes: this.todoTimer.minutes
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
        if (self.todoTimer.seconds === 59) {
          self.todoTimer.seconds = 0
          self.todoTimer.minutes++
          this.saveTodoTimer()
        } else {
          self.todoTimer.seconds++
        }
      }, 1000)
    },
    stopTimer() {
      clearInterval(this.todoTimerId)
    },
    updateTimer(value) {
      this.toggleTimer(true)
      this.todoTimer.minutes = value
      this.saveTodoTimer()
    },
    toggleTimer(startTimerFlg) {
      const params = {
        id: this.todoObj.id,
        startTimerFlg: startTimerFlg
      }
      this.TOGGLE_TODO_LIST_TIMER(params)
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
    toggleVisibleCalendar() {
      this.isVisibleCalendar = !this.isVisibleCalendar
    },
    updateCalendarDate(newValueObj, typeOfDate) {
      const dateObj = {}
      dateObj[typeOfDate] = newValueObj

      this.saveTodo(this.todoObj.todo, dateObj)
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
      if (e.keyCode === 84) return this.toggleTimer(this.todoObj.startTimerFlg)
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  padding 10px 6px 3px
  color #fff
  &:hover,
  &:focus
    .iconList
      opacity 1
      pointer-events auto
.checkbox
  position absolute
  bottom 4px
  left -30px
.body
  display flex
  justify-content space-between
  align-items flex-end
.primary
  width calc(100% - 120px)
.taskName
  height 21px
  line-height 21px
  font-size 16px
  padding-left 1px
  width 100%
.timebox
  display flex
  align-items center
  font-size 12px
  letter-spacing .01em
  margin-top 2px
  color #d0d0d0
.timerbox
  display flex
  align-items center
  font-size 14px
  letter-spacing .05em
  margin-top 3px
  &.is-active
    right calc(100% + 8px)
.timerboxBtn
  color #111
  background #9acd32
  margin-left 8px
  padding 5px
  border-radius 100%
  &:hover
    cursor pointer
  &.is-active
    background #DF5656
.iconList
  opacity 0
  pointer-events none
  width 100%
  transition opacity .1s
  text-align right
  &.is-active
    opacity 1
    pointer-events auto
.startDate,
.dueDate
  width 15px
  display inline-block
  margin-left 12px
  &:hover
    cursor pointer
</style>


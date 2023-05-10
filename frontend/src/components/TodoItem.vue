<template lang="pug">
li(
  :class="$style.wrap"
  @keyup.exact.enter="startWrite"
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
        :value="todoObj.title"
        :writingMode="writingMode"
        :class="$style.taskName"
        @input-dblclick="startWrite"
        @input-end="endWrite"
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
            :dateObj="todoObj.date[icon.typeOfDate]"
            :disabled="todoObj.status === 'done'"
            @calendar-hidden="updateCalendar($event, icon.typeOfDate)"
          )
      div(:class="classNameTimerbox")
        div(v-if="todoObj.status === 'done'")
          | {{ workingTime.minutes }}
          span m
        div(v-else-if="workingTime.minutes === 0")
          | {{ workingTime.seconds }}
          span s
        div(v-else)
          InputNumberAdvanced(
            :minValue="0"
            :maxValue="999"
            :initialCount="workingTime.minutes"
            :useZeroPadding="false"
            @input-change="updateTimer"
            @input-countup="updateTimer"
            @input-countdown="updateTimer"
          )
          span m
        span &nbsp;/&nbsp;
        div(v-if="todoObj.status === 'done'")
          | {{ todoObj.estimatedTime.minutes }}
          span m
        div(v-else)
          InputNumberAdvanced(
            :minValue="1"
            :maxValue="999"
            :initialCount="estimatedTime.minutes"
            :useZeroPadding="false"
            @input-change="updateEstimatedTime"
            @input-countup="updateEstimatedTime"
            @input-countdown="updateEstimatedTime"
          )
          span m
        div(
          v-if="todoObj.status === 'todo'"
          :class="classNameTimerboxBtn"
          @click="toggleTimer(todoObj.isTimerStarted)"
        )
</template>

<script>
import BaseCheckbox from '@/components/BaseCheckbox'
import Calendar from '@/components/Calendar'
import InputNumberAdvanced from '@/components/InputNumberAdvanced'
import InputReadingWriting from '@/components/InputReadingWriting'

import { mapActions, mapGetters, mapMutations } from 'vuex'
import { mixinSuggestDateFromTo } from '@/mixins/suggestDateFromTo'

export default {
  name: 'TodoItem',
  components: {
    BaseCheckbox,
    Calendar,
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
      writingMode: false,
      waitTimerId: null,
      todoTimerId: null,
      workingTime: {
        seconds: 0,
        minutes: 0
      },
      estimatedTime: {
        minutes: 1
      },
      delayOfUpdateTime: 3000,
      timerIdWorkingTime: null,
      timerIdEstimatedTime: null,
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
          [this.$style['is-active']]: this.todoObj.isTimerStarted
        }
      ]
    },
    isTimerStarted() {
      return this.todoObj.isTimerStarted
    }
  },
  watch: {
    isTimerStarted: {
      handler: function (value) {
        if (value) return this.startTimer()
        this.stopTimer()
      },
      immediate: true
    }
  },
  created() {
    const todoObj = this.todoObj
    this.workingTime.minutes = todoObj.workingTime.minutes
    this.estimatedTime.minutes = todoObj.estimatedTime.minutes
  },
  methods: {
    ...mapMutations('todos', [
      'ADD_TODO',
      'EDIT_TODO',
      'REMOVE_TODO',
    ]),
    ...mapActions('todos', [
      'updateTodo',
      'deleteTodo',
    ]),
    updateTaskName(newValue) {
      this.taskName = newValue
    },
    startWrite() {
      this.writingMode = true
    },
    endWrite(text) {
      this.writingMode = false
      this.saveTodo(text)
      this.$el.focus()
    },
    removeTodo() {
      this.deleteTodo({
        status: this.todoObj.status,
        id: this.todoObj.id
      })
      this.$emit('todo-removed')
    },
    doneTodo() {
      const newTodo = {
        id: this.todoObj.id,
        title: this.todoObj.title,
        status: 'done',
        isTimerStarted: false,
        workingTime: this.workingTime,
        estimatedTime: this.estimatedTime,
        date: this.todoObj.date
      }
      this.REMOVE_TODO({
        id: this.todoObj.id,
        status: 'todo'
      })
      this.ADD_TODO(newTodo)

      // APIとしてはupdate
      this.updateTodo(newTodo)
    },
    saveTodo(text, dateObj) {
      const date = Object.assign({}, this.todoObj.date)

      if (dateObj && Object.keys(dateObj).length) {
        Object.keys(dateObj).forEach(key => date[key] = dateObj[key])
      }

      const todo = {
        ...this.todoObj,
        title: text,
        workingTime: this.workingTime,
        estimatedTime: this.estimatedTime,
        date,
      }
      this.updateTodo(todo)
    },
    toggleChecked() {
      this.isChecked = !this.isChecked
      this.executeAfter(this.doneTodo, 1500, 'waitTimerId', true)
    },
    startTimer() {
      this.todoTimerId = setInterval(() => {
        if (this.workingTime.seconds === 59) {
          this.workingTime.seconds = 0
          this.workingTime.minutes++
          this.saveTodo(this.todoObj.title)
        } else {
          this.workingTime.seconds++
        }
      }, 1000)
    },
    stopTimer() {
      clearInterval(this.todoTimerId)
    },
    updateEstimatedTime(value) {
      this.estimatedTime.minutes = value

      this.executeAfter(
        () => this.saveTodo(this.todoObj.title),
        this.delayOfUpdateTime,
        'timerIdEstimatedTime'
      )
    },
    updateTimer(value) {
      this.todoObj.isTimerStarted = false
      this.workingTime.minutes = value
      console.log(value)

      this.executeAfter(
        () => {
          this.saveTodo(this.todoObj.title)
        },
        this.delayOfUpdateTime,
        'timerIdWorkingTime'
      )
    },
    toggleTimer(isTimerStarted) {
      this.updateTodo({ ...this.todoObj, isTimerStarted: !isTimerStarted })
    },
    executeAfter(callback, delay, timerIdName = 'waitTimerId', cancelWhen2ndTime = false) {
      if (this[timerIdName]) {
        clearTimeout(this[timerIdName])
        this[timerIdName] = null
        if (cancelWhen2ndTime) {
          return
        }
      }

      this[timerIdName] = setTimeout(() => {
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
    updateCalendar(newValueObj, typeOfDate) {
      const dateObj = {}
      dateObj[typeOfDate] = newValueObj

      this.saveTodo(this.todoObj.title, dateObj)
      this.toggleVisibleCalendar()
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
      if (e.keyCode === 84) return this.toggleTimer(this.todoObj.isTimerStarted)
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


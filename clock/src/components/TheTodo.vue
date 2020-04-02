<template lang="pug">
div(:class="$style.wrap")
  h1(:class="$style.title") Todo
  div(:class="$style.form")
    div(:class="$style.inputWrap")
      BaseInput(
        v-model="text"
        :disabled="getSelectedStatus === 'done'"
        :class="[$style.input, { [$style['is-active']]: mixinIsVisibleSuggestionList }]"
        placeholder="New Todo"
        @input="mixinCheckValue(text)"
        @shortcut_key-meta-enter="checkValueAndAddTodo(text)"
      )
      SuggestionResultList(
        v-if="mixinIsVisibleSuggestionList"
        :class="$style.suggestionList"
        :currentText="text"
        :resultList="mixinSuggestionDateList"
        @suggestion-selected="mixinHandleSelectSuggestion"
      )
    button(
      type="button"
      :class="$style.btn"
      :disabled="getSelectedStatus === 'done'"
      @click="checkValueAndAddTodo(text)"
    ) 追加
  ul(:class="$style.statusList")
    li(
      :class="[$style.status, { [$style['is-active']]: status === 'todo' } ]"
      @click="switchStatus('todo')"
    ) todo
    li(
      :class="[$style.status, { [$style['is-active']]: status === 'done' } ]"
      @click="switchStatus('done')"
    ) done
  transition-group(
    tag="ul"
    name="todoItem"
    :class="$style.list"
  )
    TodoItem(
      v-for="(todo, index) in getTodosByStatus"
      :key="todo.id"
      :class="$style.listItem"
      :todoObj="todo"
      tabindex="0"
      @todo-removed="autoFocusTodoByIndex(index)"
    )
</template>

<script>
import BaseInput from '@/components/BaseInput'
import SuggestionResultList from '@/components/SuggestionResultList'
import InputSuggestDate from '@/components/InputSuggestDate'
import TodoItem from '@/components/TodoItem'

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { mixinSuggestDateFromTo } from '@/mixins/suggestDateFromTo'

import getUniqueStr from '@/utils/getUniqueStr'

export default {
  name: 'TheTodo',
  components: {
    BaseInput,
    InputSuggestDate,
    SuggestionResultList,
    TodoItem
  },
  mixins: [mixinSuggestDateFromTo],
  data() {
    return {
      text: '',
      status: 'todo'
    }
  },
  computed: {
    ...mapGetters('todos', [
      'getTodosByStatus',
      'getSelectedStatus'
    ]),
    todoList() {
      return this.$el.getElementsByClassName(`${this.$style.list}`)[0]
    },
    notExistsTodo() {
      if (this.todoList.children.length === 0) return true
      return false
    },
    taskName() {
      const regex = new RegExp('(From |To )([0-9]| |/|.)+', 'g')
      const formatText = this.text.replace(regex, '')
      const textWithoutTrailingSpaces = formatText.replace(/\s*$/, '')

      return textWithoutTrailingSpaces
    }
  },
  created() {
    this.fetchTodos()
  },
  mounted() {
    this.handleKeypress()
  },
  methods: {
    ...mapMutations('todos', [
      'UPDATE_SELECTED_STATUS',
      'ADD_TODO',
      'REPLACE_TODOS'
    ]),
    ...mapActions('todos', [
      'fetchTodos'
    ]),
    addTodo(text) {
      const selectedDateFromTo = this.mixinSelectedDateFromTo(text)
      console.log(selectedDateFromTo)

      const todo = {
        id: getUniqueStr(),
        todo: this.taskName,
        status: 'todo',
        startTimerFlg: false,
        workingTimer: {
          seconds: 0,
          minutes: 0,
          hours: 0
        },
        date: {
          fromDate: selectedDateFromTo.fromDate,
          toDate: selectedDateFromTo.toDate
        }
      }

      this.ADD_TODO(todo)
      this.$el.querySelector(`.${this.$style.input}`).focus()
      this.text = ''
    },
    checkValueAndAddTodo(value) {
      if (!value) return
      this.mixinCloseSuggestionList()

      this.addTodo(value)
    },
    activeElement() {
      const $activeEl = document.activeElement
      const attrTag = $activeEl.getAttribute('data-tag')
      return {
        tagName: attrTag,
        $current: $activeEl,
        $prevEl: $activeEl.previousElementSibling,
        $nextEl: $activeEl.nextElementSibling
      }
    },
    autoFocusTodoByIndex(index) {
      const todos = this.todoList.children
      let targetIndex = index + 1

      if (todos.length === 1) return
      if (todos.length - 1 <= index) targetIndex = index - 1

      todos[targetIndex].focus()
    },
    focusPrev() {
      if (this.notExistsTodo) return

      const activeEl = this.activeElement()
      const $listItemLastChild = this.todoList.lastElementChild

      if (activeEl.tagName === 'input') return
      if (activeEl.tagName === 'body') return $listItemLastChild.focus()
      if (!activeEl.$prevEl) return $listItemLastChild.focus()

      activeEl.$prevEl.focus()
    },
    focusNext() {
      if (this.notExistsTodo) return

      const activeEl = this.activeElement()
      const $listItemFirstChild = this.todoList.firstElementChild

      if (activeEl.tagName === 'input') return
      if (activeEl.tagName === 'body') return $listItemFirstChild.focus()
      if (!activeEl.$nextEl) return $listItemFirstChild.focus()
      activeEl.$nextEl.focus()
    },
    replaceTodos(direction) {
      if (this.notExistsTodo) return

      const activeEl = this.activeElement()
      const exceptList = ['input', 'body']
      if (exceptList.includes(activeEl.tagName)) return

      const index = [...this.todoList.children].indexOf(activeEl.$current)
      const prevIndex = direction === 'top' ? index - 1 : index
      const nextIndex = direction === 'bottom' ? index + 1 : index

      if (prevIndex < 0) return
      if (nextIndex > this.todoList.children.length) return

      this.REPLACE_TODOS({ prevIndex, nextIndex, direction })

      // vuexのstoreが更新されるのを待ってからfocus
      setTimeout(() => [
        activeEl.$current.focus()
      ], 100)
    },
    switchStatus(status) {
      this.status = status
      this.UPDATE_SELECTED_STATUS(status)
    },
    handleKeypress() {
      const self = this

      const keyStatus = {}

      // キーが押されたら実行する処理
      const shortcutKey = (e) => {
        // Windows Ctrl キー or Mac Command キー + something
        if (e.ctrlKey || e.metaKey) return this.shortcutKeyMulti(e)

        // 該当のキーコードをtrueにする
        keyStatus[e.keyCode] = true;
        // ↑
        if(keyStatus[38]) return self.focusPrev()
        // ↓
        if(keyStatus[40]) return self.focusNext()
        // esc
        if(keyStatus[27]) e.target.blur()
      }

      // キーが離されたら実行する処理
      const removeKeyStatus = (e) => keyStatus[e.keyCode] = false

      document.addEventListener('keydown', shortcutKey)
      document.addEventListener('keyup', removeKeyStatus)

      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('keydown', shortcutKey);
        document.removeEventListener('keyup', removeKeyStatus);
      })
    },
    shortcutKeyMulti(e) {
      const activeEl = this.activeElement()
      if (activeEl.tagName === 'input') return

      // ↑, ↓
      const keyCodeArrow = [38, 40]
      if (keyCodeArrow.includes(e.keyCode)) {
        const direction = e.keyCode === 38 ? 'top' : 'bottom'
        return this.replaceTodos(direction)
      }

      // k
      if (e.keyCode === 75) return this.focusPrev()
      // j
      if (e.keyCode === 74) return this.focusNext()

      if (this.getSelectedStatus !== 'todo') return
      // n
      if(e.keyCode === 78) return this.addTodo('')
    }
  }
}
</script>

<style lang="stylus" module>
@keyframes move
  0%
    left 0
  50%
    left calc(100% - 80px)
  100%
    left 0

.wrap
  color #9acd32
  padding 30px
.title
  font-size 52px
  font-weight bold
  text-align center
.form
  margin 20px auto 0
  display flex
  align-items center
  justify-content center
.input,
.btn
  appearance none
  background transparent
  border 2px solid #9acd32
  border-radius 25px
  color #fff
  font-size 16px
  height 45px
  &:disabled
    color #888
    border-color rgba(#9acd32, .5)
    &::placeholder
      color #888
    &:after
      display none
    &:hover
      cursor default
.inputWrap
  position relative
.input
  padding 0 16px
  width 400px
  &::placeholder
    color #fff
    font-size 16px
  &.is-active
    border-bottom-left-radius initial
    border-bottom-right-radius @border-bottom-left-radius
.suggestionList
  border-bottom-left-radius 25px
  border-bottom-right-radius @border-bottom-left-radius
.btn
  margin-left 18px
  width 80px
  &:hover
    cursor pointer
  &:focus
    outline none
    position relative
    z-index 1
    &:after
      @keyframes ripple
        0%
          opacity 0
        50%
          opacity 1
        100%
          opacity 0
          transform scale(1.01)

      animation ripple 1s infinite ease
      background transparent
      border 1px solid #9acd32
      border-radius 999px
      bottom 0
      content ''
      display block
      height calc(100% + 12px * 2)
      left -12px
      margin auto
      opacity 0
      position absolute
      right @left
      top 0
      transform scale(.8)
      width @height
      z-index -1
.statusList
  text-align center
  margin 20px 0
  display flex
  justify-content center
  align-items center
  .status
    padding 5px
    background-color transparent
    color #fff
    font-size 16px
    font-weight bold
    width 249px
    border-bottom 2px solid #9acd32
    &.is-active
      background #9acd32
.list
  margin 40px auto 0
  width 498px
  position relative
.listItem
  border-bottom 1px solid #9acd32
  position relative
  transition .3s
  width 100%
  &:focus
    outline none
    border-bottom 1px solid #111
    &::after
      position absolute
      bottom -1px
      left 0
      height 1px
      background #9acd32
      width 80px
      content ''
      display block
      animation move 2s infinite linear
</style>

<style lang="stylus" scoped>
.todoItem-enter-active
  transform translateY(-20px)
.todoItem-leave-to
  transition .1s
.todoItem-enter-active,
.todoItem-leave-to
  opacity 0
.todoItem-leave-active
  position absolute
  left 0
</style>

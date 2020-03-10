<template lang="pug">
div(:class="$style.wrap")
  h1(:class="$style.title") Todo
  div(:class="$style.form")
    input(
      v-model="text"
      :class="$style.input"
      data-tag="input"
      placeholder="New Todo"
      @keydown="handleKeydownInput"
    )
    button(
      type="button"
      :class="$style.btn"
      @click="addTodo(text)"
    ) 追加
  ul(:class="$style.statusList")
    li(
      :class="[$style.status, { [$style['is-active']]: status === 'todo' } ]"
      @click="switchStatus('todo')"
    ) todo
    li(
      :class="[$style.status, { [$style['is-active']]: status === 'completed' } ]"
      @click="switchStatus('completed')"
    ) completed
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
import TodoItem from '@/components/TodoItem'

import { mapGetters, mapActions, mapMutations } from 'vuex'

import getUniqueStr from '@/utils/getUniqueStr'

export default {
  name: 'TheTodo',
  components: {
    TodoItem,
  },
  data() {
    return {
      text: '',
      status: 'todo'
    }
  },
  computed: {
    ...mapGetters('todos', [
      'getTodosByStatus'
    ]),
    todoList() {
      return this.$el.getElementsByClassName(`${this.$style.list}`)[0]
    },
    notExistsTodo() {
      if (this.todoList.children.length === 0) return true
      return false
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
      const todo = {
        id: getUniqueStr(),
        todo: text,
        status: 'todo',
        workingTimer: {
          seconds: 0,
          minutes: 0,
          hours: 0
        }
      }
      this.ADD_TODO(todo)
      this.$el.querySelector(`.${this.$style.input}`).focus()
      this.text = ''
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

      if (activeEl.attrData === 'input') return
      if (activeEl.attrData === 'body') return $listItemFirstChild.focus()
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
    handleKeydownInput(e) {
      // Windows Ctrl キー or Mac Command キー + enter の判定
      // https://hacknote.jp/archives/7321/
      if (e.ctrlKey && e.metaKey) return
      if (!e.ctrlKey && !e.metaKey) return
      if (e.keyCode === 13) return this.addTodo(this.text)
    },
    shortcutKeyMulti(e) {
      // ↑, ↓
      const keyCodeArrow = [38, 40]
      if (keyCodeArrow.includes(e.keyCode)) {
        const direction = e.keyCode === 38 ? 'top' : 'bottom'
        return this.replaceTodos(direction)
      }

      // n
      if(e.keyCode === 78) return this.addTodo('')
      // k
      if (e.keyCode === 75) return this.focusPrev()
      // j
      if (e.keyCode === 74) return this.focusNext()
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
  padding 50px
.title
  font-size 52px
  font-weight bold
  text-align center
.form
  margin 20px auto 0
  text-align center
.input,
.btn
  appearance none
  background transparent
  border 2px solid #9acd32
  border-radius 25px
  color #fff
  display inline-block
  font-size 16px
  height 45px
  vertical-align middle
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
.input
  padding 0 16px
  width 400px
  &::placeholder
    color #fff
    font-size 16px
.btn
  margin-left 18px
  width 80px
  &:hover
    cursor pointer
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
    font-size 14px
    &.is-active
      background #9acd32
.list
  margin 50px auto 0
  width 498px
  position relative
.listItem
  border-bottom 2px solid #9acd32
  position relative
  display inline-block
  transition .3s
  width 100%
  margin-bottom 20px
  &:focus
    outline none
    border-bottom 2px solid #111
    &::after
      position absolute
      bottom -2px
      left 0
      height 2px
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

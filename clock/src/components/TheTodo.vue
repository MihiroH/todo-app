<template lang="pug">
div(:class="$style.wrap")
  h1(:class="$style.title") Todo
  div(:class="$style.form")
    input(
      v-model="text"
      :class="$style.input"
      data-tag="input"
      placeholder="New Todo"
      @keyup.exact.alt.enter="addTodo(text)"
    )
    button(
      type="button"
      :class="$style.btn"
      @click="addTodo(text)"
    ) 追加
  transition-group(
    tag="ul"
    name="todoItem"
    :class="$style.list"
  )
    TodoItem(
      v-for="todo in getTodos"
      :key="todo.id"
      :class="$style.listItem"
      :task="todo.todo"
      :uid="todo.id"
      tabindex="0"
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
      text: ''
    }
  },
  computed: {
    ...mapGetters('todos', [
      'getTodos'
    ])
  },
  created() {
    this.fetchTodos()
  },
  mounted() {
    this.handleKeypress()
  },
  methods: {
    ...mapMutations('todos', [
      'ADD_TODO'
    ]),
    ...mapActions('todos', [
      'fetchTodos'
    ]),
    addTodo(text) {
      if (text) {
        const todo = {
          id: getUniqueStr(),
          todo: text
        }
        this.ADD_TODO(todo)

        this.text = ''
      }

      this.$el.querySelector(`.${this.$style.input}`).focus()
    },
    prevTodo() {
      const $activeEl = document.activeElement
      const $prevEl = $activeEl.previousElementSibling
      const $listItemLastChild = this.$el.querySelector(`.${this.$style.listItem}:last-child`)
      const attrData = $activeEl.getAttribute('data-tag')

      if (attrData === 'input') return
      if (attrData === 'body') return $listItemLastChild.focus()
      if (!$prevEl) return $listItemLastChild.focus()
      $prevEl.focus()
    },
    nextTodo() {
      const $activeEl = document.activeElement
      const $nextEl = $activeEl.nextElementSibling
      const $listItemFirstChild = this.$el.querySelector(`.${this.$style.listItem}:first-child`)
      const attrData = $activeEl.getAttribute('data-tag')

      if (attrData === 'input') return
      if (attrData === 'body') return $listItemFirstChild.focus()
      if (!$nextEl) return $listItemFirstChild.focus()
      $nextEl.focus()
    },
    handleKeypress() {
      const self = this

      const keyStatus = {}

      // キーが押されたら実行する処理
      const shortcutKey = (e) => {
        // 該当のキーコードをtrueにする
        keyStatus[e.keyCode] = true;
        // option(alt) + n
        if(keyStatus[18] && keyStatus[78]) return self.addTodo('')
        // ↑
        if(keyStatus[38]) return self.prevTodo()
        // ↓
        if(keyStatus[40]) return self.nextTodo()
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
      });
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

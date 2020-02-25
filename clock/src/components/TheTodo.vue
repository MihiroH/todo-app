<template lang="pug">
div(:class="$style.wrap")
  h1(:class="$style.title") Todo
  div(:class="$style.form")
    input(
      v-model="text"
      :class="$style.input"
      placeholder="New Todo"
      @keyup.exact.alt.enter="addTodo(text)"
    )
    button(
      type="button"
      :class="$style.btn"
      @click="addTodo(text)"
    ) 追加
  ul(:class="$style.list")
    TodoItem(
      v-for="todo in getTodos"
      :key="todo.id"
      :class="[$style.listItem, { [$style['is-active']]: editModeFlg } ]"
      :task="todo.todo"
      :uid="todo.id"
      @edit-icon-click="editModeFlg = true"
      @input-end="editModeFlg = false"
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
      editModeFlg: false
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
      if (!text) return

      const todo = {
        id: getUniqueStr(),
        todo: text
      }
      this.ADD_TODO(todo)

      this.text = ''
      this.$el.querySelector(`.${this.$style.input}`).focus()
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
.listItem
  border-bottom 2px solid #9acd32
  position relative
  &.is-active,
  &:hover
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
  &:not(:first-child)
    margin-top 20px
</style>

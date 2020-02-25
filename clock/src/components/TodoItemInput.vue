<template lang="pug">
input(
  type="text"
  v-model="value"
  :class="$style.todoInput"
  @blur="saveEdit"
  @keyup.exact.alt.enter="saveEdit"
  @keyup.esc="saveEdit"
)
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'TodoItem',
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
      value: ''
    }
  },
  mounted() {
    this.value = this.task
    this.$el.focus()
  },
  methods: {
    ...mapMutations('todos', [
      'EDIT_TODO',
      'REMOVE_TODO'
    ]),
    saveEdit() {
      if (this.value === '') {
        this.value = this.task
      } else {
        this.EDIT_TODO({
          id: this.uid,
          todo: this.value
        })
      }

      this.$emit('input-end')
    }
  }
}
</script>

<style lang="stylus" module>
.todoInput
  border none
  background transparent
  padding 3px
  padding-left 0
  outline none
  font inherit
  color inherit
</style>

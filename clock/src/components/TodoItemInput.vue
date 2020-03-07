<template lang="pug">
input(
  type="text"
  v-model="value"
  :class="$style.todoInput"
  data-tag="input"
  @input="handleInput"
  @blur="end"
  @keyup.esc="end"
  @keydown="handleKeydown"
)
</template>

<script>
export default {
  name: 'TodoItemInput',
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
    end() {
      this.$emit('input-end')
    },
    handleInput() {
      this.$emit('input', this.value)
    },
    handleKeydown(e) {
      if (e.ctrlKey && e.metaKey) return
      if (!e.ctrlKey && !e.metaKey) return
      if (e.keyCode === 13) return this.end()
    }
  }
}
</script>

<style lang="stylus" module>
.todoInput
  border none
  background transparent
  padding 4px
  padding-left 0
  outline none
  font inherit
  color inherit
  display block
  width 100%
</style>

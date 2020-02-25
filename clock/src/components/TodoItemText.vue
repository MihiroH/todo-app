<template lang="pug">
div(:class="$style.wrap")
  div(
    :class="$style.icon"
    @click="edit"
  )
    img(
      src="@/assets/icon_pen.svg"
      alt="編集する"
    )
  p(
    :class="$style.txt"
  ) {{ task }}
  div(
    :class="$style.icon"
    @click="removeTodo"
  )
    img(
      src="@/assets/icon_trash_can.svg"
      alt="削除する"
    )
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    task: {
      type: String,
      required: true
    }
  },
  methods: {
    edit() {
      this.$emit('edit-icon-click')
    },
    removeTodo() {
      this.$emit('trash_can-icon-click')
    }
  }
}
</script>

<style lang="stylus" module>
.icon,
.txt
  display inline-block
  vertical-align middle
.icon
  width 16px
  &:hover
    cursor pointer
.txt
  margin-left 12px
  background transparent
  padding 5px
  padding-left 0
  outline none
  font-size 16px
  & + .icon
    position absolute
    top 50%
    right 8px
    transform translateY(-50%)
</style>


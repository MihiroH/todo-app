<template lang="pug">
div(
  :class="$style.wrap"
  @dblclick="handleDoubleClick"
)
  BaseCheckbox(
    v-if="status === 'todo'"
    :isChecked="isChecked"
    :class="$style.checkbox"
    @checkbox-click="handleClickCheckbox"
  )
  p(:class="$style.txt") {{ task }}
  div(:class="$style.icons")
    div(
      v-if="status === 'todo'"
      :class="$style.icon"
      @click="edit"
    )
      img(
        src="@/assets/icon_pen.svg"
        alt="編集する"
      )
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
import BaseCheckbox from '@/components/BaseCheckbox'

export default {
  name: 'TodoItem',
  components: {
    BaseCheckbox
  },
  props: {
    task: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    isChecked: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    edit() {
      this.$emit('edit-icon-click')
    },
    removeTodo() {
      this.$emit('trash_can-icon-click')
    },
    handleDoubleClick() {
      this.$emit('item-doubleclick')
    },
    handleClickCheckbox() {
      this.$emit('checkbox-click')
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  position relative
.checkbox
  position absolute
  top 5px
  left -30px
.icon,
.txt
  display inline-block
  vertical-align middle
.txt
  background transparent
  padding 5px
  padding-left 0
  outline none
  font-size 16px
  white-space nowrap
  max-width calc(100% - 64px)
  overflow hidden
  text-overflow ellipsis
.icons
  position absolute
  top 50%
  right 8px
  transform translateY(-50%)
.icon
  margin-left 16px
  width 16px
  &:hover
    cursor pointer
</style>


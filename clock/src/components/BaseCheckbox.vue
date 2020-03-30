<template lang="pug">
div(
  :class="[ $style.wrap, { [$style['is-checked']]: isChecked } ]"
  @click="handleClick"
)
</template>

<script>
export default {
  name: 'BaseCheckbox',
  props: {
    isChecked: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('checkbox-click')
    }
  }
}
</script>

<style lang="stylus" module>
@keyframes shrink-bounce
  0%
    transform scale(1)
  33%
    transform scale(.85)
  100%
    transform scale(1)

@keyframes checkbox-check
  0%
    width 0
    height 0
  33%
    width 5px
    height 0
  100%
    width 5px
    height 10px
    border-color #111

.wrap
  width 2.5px * 4 * 2
  height @width
  background transparent
  border 1px solid #9E9E9E
  border-radius 50%
  cursor pointer
  transition all .25s cubic-bezier(.4,.0,.23,1)
  position relative
  &.is-checked
    border (2.5px * 4) solid #9acd32
    animation shrink-bounce .2s cubic-bezier(.4,.0,.23,1)
    &:before
      content ""
      position absolute
      top 50%
      left 0
      border-right 1px solid transparent
      border-bottom 1px solid transparent
      transform translate3d(-90%, -90%, 0) rotate(45deg)
      transform-origin 0% 100%
      animation checkbox-check 125ms 250ms cubic-bezier(.4,.0,.23,1) forwards
</style>



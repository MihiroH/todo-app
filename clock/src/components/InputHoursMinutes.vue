<template lang="pug">
div
  InputNumberAdvanced(
    :minValue="0"
    :maxValue="24"
    :initializeCount="12"
    :useZeroPadding="true"
    :class="$style.numberbox"
    @input-keydown="moveFocus($event, 0)"
  )
  span :
  InputNumberAdvanced(
    :minValue="0"
    :maxValue="59"
    :initializeCount="0"
    :class="$style.numberbox"
    :useZeroPadding="true"
    @input-keydown="moveFocus($event, 1)"
  )
</template>

<script>
import InputNumberAdvanced from '@/components/InputNumberAdvanced'
export default {
  name: 'InputHoursMinutes',
  components: {
    InputNumberAdvanced
  },
  methods: {
    moveFocus(keyCode, index) {
      // 37: ←
      // 39: →
      if (keyCode !== 37 && keyCode !== 39) return

      const targetIndex = index ? 0 : 1
      const $target = this.$el.querySelectorAll(`.${this.$style.numberbox}`)[targetIndex]
      $target.focus()
    }
  }
}
</script>

<style lang="stylus" module>
.numberbox
  vertical-align middle
</style>

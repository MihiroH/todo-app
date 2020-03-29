<template lang="pug">
div(
  :class="$style.wrap"
  tabindex="-1"
  @keydown="hendleKeydown"
) {{ zeroPadding(value) }}
</template>

<script>
import { zeroPadding as $_zeroPadding} from '@/utils/zeroPadding'

export default {
  name: 'InputNumberAdvanced',
  props: {
    minValue: {
      type: Number,
      required: true,
      validator(value) {
        return value >= 0
      }
    },
    maxValue: {
      type: Number,
      required: true,
      validator(value) {
        return value >= 1
      }
    }
  },
  data() {
    return {
      value: 0,
      inputCount: 0,
      inputNumberHistory: []
    }
  },
  computed: {
    zeroPadding() {
      return value => {
        return $_zeroPadding(value, this.strMaxValue.length)
      }
    },
    strMinValue() {
      return String(this.minValue)
    },
    strMaxValue() {
      return String(this.maxValue)
    }
  },
  mounted() {
    const minValue = this.minValue
    const maxValue = this.maxValue

    if (minValue === maxValue) {
      console.error('minValueの値がmaxValueの値と同じです')
      return
    }
    if (minValue > maxValue) {
      console.error('minValueの値がmaxValueの値を超えています')
      return
    }

    this.value = minValue
  },
  methods: {
    initInputHis(value) {
      return this.strMaxValue < value
    },
    countup() {
      const value = this.value
      if (value === this.maxValue) return this.value = this.minValue
      this.value++
    },
    countdown() {
      const value = this.value
      if (value === this.minValue) return this.value = this.maxValue
      this.value--
    },
    hendleKeydown(e) {
      const keycode = e.keyCode
      const char = String.fromCharCode(event.keyCode)

      if (keycode === 38) return this.countup()
      if (keycode === 40) return this.countdown()
      if (/\D/.test(char)) return

      clearTimeout(this.timerId)
      this.timerId = setTimeout(() => {
        this.inputNumberHistory = []
        this.inputCount = 0
      }, 800)

      this.inputNumberHistory.splice(this.inputCount, 1, char)

      let result = this.inputNumberHistory
      if (result.join('') > this.maxValue) return

      this.inputCount === this.strMaxValue.length - 1
        ? this.inputCount = 0
        : this.inputCount++

      this.value = result.join('')
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  border-radius 4px
  padding 1.5px
  display inline-block
  color #fff
  &:focus
    background #4eaad4
    outline none
</style>

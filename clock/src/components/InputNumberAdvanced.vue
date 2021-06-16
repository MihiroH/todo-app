<template lang="pug">
div(
  :class="$style.wrap"
  tabindex="-1"
  data-tag="input"
  @keydown="hendleKeydown"
) {{ formatValue(currentValue) }}
</template>

<script>
import { zeroPadding } from '@/utils/zeroPadding'

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
    },
    initialCount: {
      type: Number,
      required: true,
      validator(value) {
        return value >= 0
      }
    },
    useZeroPadding: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      inputCount: 0,
      inputNumberHistory: []
    }
  },
  computed: {
    formatValue() {
      return value => {
        if (this.useZeroPadding) return zeroPadding(value, this.strMaxValue.length)

        return value
      }
    },
    strMinValue() {
      return String(this.minValue)
    },
    strMaxValue() {
      return String(this.maxValue)
    },
    currentValue() {
      const minValue = this.minValue
      const maxValue = this.maxValue
      const initialCount = this.initialCount

      if (minValue === maxValue) {
        console.error('minValueの値がmaxValueの値と同じです')
        return 0
      }
      if (minValue > maxValue) {
        console.error('minValueの値がmaxValueの値を超えています')
        return 0
      }
      if (initialCount < minValue) {
        console.error('initialCountの値がminValueの値より小さいです')
        return 0
      }

      return this.initialCount
    }
  },
  methods: {
    countup() {
      let result = 0
      if (this.currentValue === this.maxValue) result = this.minValue
      else result = this.currentValue + 1

      this.$emit('input-countup', result)
    },
    countdown() {
      let result = 0
      if (this.currentValue === this.minValue) result = this.maxValue
      else result = this.currentValue - 1

      this.$emit('input-countdown', result)
    },
    hendleKeydown(e) {
      const keyCode = e.keyCode
      const char = String.fromCharCode(keyCode)

      if (keyCode === 38) return this.countup()
      if (keyCode === 40) return this.countdown()
      if (/\D/.test(char)) return

      clearTimeout(this.timerId)
      this.timerId = setTimeout(() => {
        this.inputNumberHistory = []
        this.inputCount = 0
      }, 800)

      this.inputNumberHistory.splice(this.inputCount, 1, char)
      let result = this.inputNumberHistory

      if (result.join('') > this.maxValue) return
      if (result.join('') < this.minValue) return

      this.inputCount === this.strMaxValue.length - 1
        ? this.inputCount = 0
        : this.inputCount++

      this.$emit('input-change', Number(result.join('')))
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  border-radius 4px
  padding 2px 1px
  display inline-block
  &:focus
    background #4eaad4
    outline none
    color #fff
</style>

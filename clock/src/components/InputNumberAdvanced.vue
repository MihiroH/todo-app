<template lang="pug">
div(
  :class="$style.wrap"
  tabindex="-1"
  data-tag="input"
  @keydown="hendleKeydown"
) {{ formatValue(value) }}
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
    initializeCount: {
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
      value: 0,
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
    }
  },
  mounted() {
    const minValue = this.minValue
    const maxValue = this.maxValue
    const initializeCount = this.initializeCount

    if (minValue === maxValue) {
      console.error('minValueの値がmaxValueの値と同じです')
      return
    }
    if (minValue > maxValue) {
      console.error('minValueの値がmaxValueの値を超えています')
      return
    }
    if (initializeCount < minValue) {
      console.error('initializeCountの値がminValueの値より小さいです')
      return
    }

    this.value = this.initializeCount
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
      const keyCode = e.keyCode
      const char = String.fromCharCode(keyCode)

      this.$emit('input-keydown', keyCode)

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
  padding 2px 1px
  display inline-block
  &:focus
    background #4eaad4
    outline none
    color #fff
</style>

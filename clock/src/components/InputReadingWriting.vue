<template lang="pug">
div(:class="$style.wrap")
  BaseInput(
    v-if="writingMode"
    :value="text"
    :class="$style.input"
    @input="handleInput"
    @input-blur="end"
    @shortcut_key-esc="blur"
    @shortcut_key-meta-enter="blur"
  )
  p(
    v-else
    :class="$style.text"
    @dblclick="write"
  ) {{ text }}
</template>


<script>
import BaseInput from '@/components/BaseInput'

export default {
  name: 'InputReadingWriting',
  components: {
    BaseInput
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      writingMode: false,
      text: ''
    }
  },
  mounted() {
    this.text = this.value
  },
  methods: {
    async write() {
      this.writingMode = true
      this.text = this.value

      await this.$nextTick()
      this.$el.querySelector(`.${this.$style.input}`).focus()
    },
    end() {
      this.writingMode = false

      const newValue = this.text ? this.text : this.value
      this.text = newValue
      this.$emit('input-end', newValue)
    },
    blur() {
      this.$el.querySelector(`.${this.$style.input}`).blur()
    },
    handleInput(newValue) {
      this.text = newValue
    }
  }
}
</script>

<style lang="stylus" module>
.wrap,
.input,
.text
  height inherit
.input,
.text
  padding 0
  width 100%
.text
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
</style>

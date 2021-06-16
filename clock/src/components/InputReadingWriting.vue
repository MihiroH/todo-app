<template lang="pug">
div(
  :class="$style.wrap"
  @keyup.exact.enter="edit"
)
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
    },
    writingMode: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      text: ''
    }
  },
  mounted() {
    this.text = this.value
  },
  async updated() {
    if (!this.writingMode) return false

    await this.$nextTick()
    this.$el.querySelector(`.${this.$style.input}`).focus()
  },
  methods: {
    async write() {
      this.text = this.value

      this.$emit('input-dblclick')
    },
    end() {
      this.$emit('input-end')

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

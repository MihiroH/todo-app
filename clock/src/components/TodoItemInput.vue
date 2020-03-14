<template lang="pug">
BaseInput(
  type="text"
  :value="task"
  :class="$style.wrap"
  @input="handleInput"
  @input-end="end"
  @shortcut_key-meta-enter="end"
)
</template>

<script>
import BaseInput from '@/components/BaseInput'

export default {
  name: 'TodoItemInput',
  components: {
    BaseInput
  },
  props: {
    task: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.$el.focus()
  },
  methods: {
    end() {
      this.$emit('input-end')
    },
    handleInput(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  padding 4px 4px 4px 0
</style>

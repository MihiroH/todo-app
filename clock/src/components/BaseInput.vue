<template lang="pug">
input(
  v-model="text"
  type="text"
  :class="$style.wrap"
  data-tag="input"
  @blur="end"
  @keyup.esc="end"
  @keydown="handleKeydown"
)
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    text: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  methods: {
    end() {
      this.$emit('input-end')
    },
    handleKeydown(e) {
      if (e.ctrlKey && e.metaKey) return
      if (!e.ctrlKey && !e.metaKey) return
      if (e.keyCode === 13) return this.$emit('shortcut_key-meta-enter')
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  border none
  background transparent
  outline none
  font inherit
  color inherit
  display block
  width 100%
</style>

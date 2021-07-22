<template lang="pug">
div(:class="$style.wrap")
  div(:class="$style.circle")
  div(:class="$style.circle")
</template>

<script>
export default {
  name: 'Separation'
}
</script>

<style lang="stylus" module>
.wrap
  display flex
  flex-direction column
  justify-content space-around
.circle
  background yellowgreen
  border-radius 50%
  width 10px
  height @width
</style>

<template lang="pug">
div(:class="classObj")
</template>

<script>
export default {
  name: 'ClockLightStick',
  props: {
    direction: {
      type: String,
      required: true
    },
    isInactive: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    classObj() {
      return [
        this.$style.wrap,
        this.$style[this.direction],
        {[this.$style.isInactive]: this.isInactive }
      ]
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  background yellowgreen
  border-radius 10px
.vertical
  height 50px
  width 10px
.horizontal
  height 10px
  width 50px
.isInactive
  background-color rgba(200, 255, 200, .2)
</style>

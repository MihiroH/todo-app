<template lang="pug">
div(
  :class="classObj"
)
</template>

<script>
export default {
  name: 'ClockLightStick',
  props: {
    direction: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    classObj() {
      return [
        this.$style.wrap,
        this.$style[this.direction],
        {[this.$style.isActive]: this.isActive }
      ]
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  background-color rgba(200, 255, 200, .2)
  border-radius 10px
.vertical
  height 50px
  width 10px
.horizontal
  height 10px
  width 50px
.isActive
  background yellowgreen
</style>

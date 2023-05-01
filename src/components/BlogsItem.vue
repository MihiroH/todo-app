<template lang="pug">
div(:class="[$style.wrapper, $style[`theme_${theme}`]]")
  time(
    :datetime="updatedAt"
    :class="$style.date"
  ) {{ updatedAt | formatDate }}
  h3(:class="$style.title")
    a(
      :href="url"
      target="_blank"
    ) {{ title }}
</template>

<script>
export default {
  name: 'BlogsItem',
  filters: {
    formatDate(value) {
      const date = new Date(value)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}/${month}/${day}`
    }
  },
  props: {
    theme: {
      type: String,
      require: false,
      default: 'green'
    },
    title: {
      type: String,
      require: true
    },
    url: {
      type: String,
      require: true
    },
    updatedAt: {
      type: String,
      require: true
    }
  }
}
</script>

<style lang="stylus" module>
.wrapper
  border-bottom-width 1px
  border-bottom-style solid
  padding 8px
  font-size 14px
  &:not(:first-child)
    margin-top 20px
  &.theme_green
    border-bottom-color #55c500
  &.theme_blue
    border-bottom-color #3ea8ff

.date
  color #9e9e9e
  font-size 12px

.title
  margin-top 8px
  line-height 1.4
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
</style>

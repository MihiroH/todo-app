<template lang="pug">
  TheClock
</template>

<script>
import TheClock from '@/components/TheClock'

export default {
  name: 'app',
  components: {
    TheClock
  }
}
</script>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>

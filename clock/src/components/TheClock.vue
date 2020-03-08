<template lang="pug">
div(:class="$style.wrap")
  ClockNumberPanel(
    v-for="(item, index) in 2"
    :key="`hours-${index}`"
    :class="$style.item"
    :number="getNumber(index + 1)"
  )
  Separation(:class="$style.separation")
  ClockNumberPanel(
    v-for="(item, index) in 2"
    :key="`minutes-${index}`"
    :class="$style.item"
    :number="getNumber(index + 3)"
  )
  Separation(:class="$style.separation")
  ClockNumberPanel(
    v-for="(item, index) in 2"
    :key="`seconds-${index}`"
    :class="$style.item"
    :number="getNumber(index + 5)"
  )
</template>

<script>
import ClockNumberPanel from '@/components/ClockNumberPanel';
import Separation from '@/components/Separation'
export default {
  name: 'TheClock',
  components: {
    ClockNumberPanel,
    Separation
  },
  data() {
    return {
      moment: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
  },
  computed: {
    getNumber() {
      return index => {
        // splitするためにString型に変換: hours.split()
        const hours = String(this.moment.hours)
        const minutes = String(this.moment.minutes)
        const seconds = String(this.moment.seconds)

        let number = 0
        if (index === 1) number = hours.length === 2 ? hours.split('')[0] : 0
        if (index === 2) number = hours.length === 2 ? hours.split('')[1] : hours
        if (index === 3) number = minutes.length === 2 ? minutes.split('')[0] : 0
        if (index === 4) number = minutes.length === 2 ? minutes.split('')[1] : minutes
        if (index === 5) number = seconds.length === 2 ? seconds.split('')[0] : 0
        if (index === 6) number = seconds.length === 2 ? seconds.split('')[1] : seconds

        return Number(number)
      }
    }
  },
  created() {
    const self = this
    setInterval((function moment() {
      self.moment = self.getMoment()
      return moment
    })(), 1000);
  },
  methods: {
    getMoment() {
      const now = new Date()
      return {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
      }
    }
  }
}
</script>

<style lang="stylus" module>
.wrap
  filter drop-shadow(10px 10px 10px rgba(0,0,0,0.6))
  display flex
  justify-content center
  padding 50px
.item
  margin-right 15px
.separation
  margin-right 15px
  height 130px
</style>
